import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';
import { useTheme} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { IState } from '../../store';
import {useStyles, MenuProps, getStyles, formatString} from './config'

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `query { getMetrics }`;

const getMetricsList = (state: IState) => {
  const { metricsList } = state.metrics;
  return {
    metricsList
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const Metrics = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const { metricsList } = useSelector(getMetricsList);

  const [result] = useQuery({query});

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    // @ts-ignore
    const _data = getMetrics.map(x => {
      return {
        value: x,
        label: formatString(x)
      }
    });
    dispatch(actions.metricsDataRecevied(_data));
  }, [dispatch, data, error]);

    const [selectedMetric, setMetricName] = React.useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMetricName(event.target.value as string[]);
    };

  if (fetching) return <LinearProgress />;

  return (
      <FormControl className={classes.formControl}>
          <InputLabel id="metric-select">Select Metric</InputLabel>
          <Select
              labelId="metric-select"
              id="metric-select"
              multiple
              value={selectedMetric}
              onChange={handleChange}
              input={<Input />}
              MenuProps={MenuProps}
          >
              {metricsList.map((x: {value: string, label: string}, i) => (
                  <MenuItem key={i} value={x.value} style={getStyles(x.value, selectedMetric, theme)}>
                      {x.label}
                  </MenuItem>
              ))}
          </Select>
      </FormControl>
  );
};
