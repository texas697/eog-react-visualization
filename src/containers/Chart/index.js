import React, {useState, useEffect} from 'react';
import {throttle} from 'throttle-debounce'
import {Charts, ChartContainer, ChartRow, YAxis, LineChart, styler, Resizable, Legend} from 'react-timeseries-charts';
import {useQuery, useSubscription} from 'urql';
import {useDispatch, useSelector} from 'react-redux';
import * as selectors from './selectors';
import {actions} from './reducer';
import * as utils from './utils';
import * as config from './config';

const _buildData = throttle(5000, false,(data, metrics) => utils.buildData(data, metrics));

const ChartsContainer = () => {
  const dispatch = useDispatch()
  const _metrics = useSelector(selectors.getSelectedMetrics)
  const _series = useSelector(selectors.getSeriesData)
  const _axis = useSelector(selectors.getAxisData)
  const _trafficSeries = useSelector(selectors.getTrafficSeriesData)
  const _windowHeight = useSelector(selectors.getWindowHeight)

  const query = config.query
  const [result] = useQuery(
    {
      query,
      variables: {
        input: _metrics.map(metricName => ({
          metricName,
          after: utils.thirtyMinutesAgo
        }))
      }
    }, [_metrics])

  const {data, error} = result
  const [subscriptionResponse] = useSubscription({
    query: config.newMessages
  });

  const _subscriptionData = subscriptionResponse.data;
  if (_subscriptionData && data.getMultipleMeasurements) {
    data.getMultipleMeasurements.forEach(x => {
      if (x.metric === _subscriptionData.newMeasurement.metric) x.measurements.push(_subscriptionData.newMeasurement);
    });
    if (data.getMultipleMeasurements[0]) _buildData(data, _metrics);
  }

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementsApiErrorReceived({error: error.message}))
      return
    }
    if (!data) return
    utils.buildData(data, _metrics)
  }, [dispatch, data, error]) // eslint-disable-line

  const [tracker, setTracker] = useState(null)
  const [trackerInfo, setTrackerInfo] = useState([])

  const onTrackerChanged = t => {
    setTracker(t)
    if (!t) {
      setTrackerInfo([])
    } else {
      setTrackerInfo(
        _series.map(s => {
          const i = s.bisect(new Date(t))
          return {
            label: s.name(),
            value: s.at(i).get('value').toString()
          }
        })
      )
    }
  }

  if (!_series || _series.length === 0) return null

  return (
    <React.Fragment>
      <Legend
        type="swatch"
        style={utils.buildLegendStyle(_series)}
        categories={utils.buildLegendCategories(_series)}
      />
      <br/>
      <Resizable>
        <ChartContainer
          timeRange={_trafficSeries.timerange([utils.thirtyMinutesAgo, new Date().getTime()])}
          onTrackerChanged={onTrackerChanged}
          trackerPosition={tracker}
        >
          <ChartRow
            height={_windowHeight - 200}
            trackerShowTime={true}
            trackerInfoValues={trackerInfo}
            trackerInfoHeight={10 + trackerInfo.length * 16}
            trackerInfoWidth={140}
          >
            {_axis.map((metricSeries, i) => (
              <YAxis
                key={i}
                id={metricSeries.id}
                label={metricSeries.label}
                min={metricSeries.min}
                max={metricSeries.max}
                width="60"
                type="linear"
              />
            ))}
            <Charts>
              {_series.map((metricSeries, i) => {
                const style = styler(
                  _series.map(() => ({
                    key: 'value',
                    color: utils.assignColor(metricSeries.atLast().get('metric')),
                    selected: '#2CB1CF'
                  }))
                )

                return (
                  <LineChart
                    key={i}
                    style={style}
                    axis={metricSeries.atLast().get('unit')}
                    series={metricSeries}
                    column={['value']}
                  />
                )
              })}
            </Charts>
          </ChartRow>
        </ChartContainer>
      </Resizable>
    </React.Fragment>
  )
}

export default ChartsContainer
