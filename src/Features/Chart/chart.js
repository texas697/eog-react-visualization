import React, { useState, useEffect, useCallback } from "react";
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
    styler,
    Resizable
} from "react-timeseries-charts";
import {Provider, useQuery} from 'urql'
import { useDispatch, useSelector } from "react-redux";
import * as selectors from './selectors'
import { actions } from './reducer';
import * as utils from './utils'
import * as config from './config'
import {client} from '../Metrics/config'

export default () => {
    return (
      <Provider value={client}>
          <ChartsContainer />
      </Provider>
    );
};

const ChartsContainer = () => {
    const dispatch = useDispatch();
    const _metrics = useSelector(selectors.getSelectedMetrics);
    const _series = useSelector(selectors.getSeriesData);
    const _axis = useSelector(selectors.getAxisData);
    const _trafficSeries = useSelector(selectors.getTrafficSeriesData);

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
        }, [_metrics]
    );

    const { data, error } = result;

    useEffect(() => {
        if (error) {
            dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
            return;
        }
        if (!data) return;

        let _seriesData = utils.buildSeriesData(data.getMultipleMeasurements)
        _seriesData = _metrics.map(metric => _seriesData[metric])

        const _axisData = utils.buildAxisData(_seriesData)
        const _trafficSeriesData = utils.buildTrafficSeriesData(_seriesData)

        dispatch(actions.receiveMeasurementData(data.getMultipleMeasurements));
        dispatch(actions.setSeriesData(_seriesData));
        dispatch(actions.setAxisData(_axisData));
        dispatch(actions.setTrafficSeriesData(_trafficSeriesData));
    }, [dispatch, data, error]);

  const [tracker, setTracker] = useState(null);
  const [trackerInfo, setTrackerInfo] = useState([]);

  const onTrackerChanged = t => {
    setTracker(t);
    if (!t) {
      setTrackerInfo([]);
    } else {
      setTrackerInfo(
        _series.map(s => {
          const i = s.bisect(new Date(t));
          return {
            label: s.name(),
            value: s.at(i).get("value").toString()
          };
        })
      );
    }
  };

  if (!_series || _series.length === 0) return null;
    return (
      <Resizable>
          <ChartContainer
            timeRange={_trafficSeries.timerange([utils.thirtyMinutesAgo, new Date().getTime()])}
            onTrackerChanged={onTrackerChanged}
            trackerPosition={tracker}
          >
              <ChartRow
                height={500}
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
                                key: "value",
                                color: config.colors[i],
                                selected: "#2CB1CF"
                            }))
                          );

                          return (
                            <LineChart
                              key={i}
                              style={style}
                              axis={metricSeries.atLast().get("unit")}
                              series={metricSeries}
                              column={["value"]}
                            />
                          );
                      })}
                  </Charts>
              </ChartRow>
          </ChartContainer>
      </Resizable>
    );
};
