import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '@material-ui/core/Select';
import { useTheme} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import {query, useStyles, MenuProps} from './config'
import * as utils from './utils'
import {getMetricsList, getSelectedMetrics} from './selectors'


const MetricsContainer = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const metricsList = useSelector(getMetricsList);
  const selectedMetrics = useSelector(getSelectedMetrics);

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
        label: utils.formatString(x)
      }
    });
    dispatch(actions.metricsDataRecevied(_data));
  }, [dispatch, data, error]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      // @ts-ignore
      dispatch(actions.setMetricsSelected(event.target.value as string[]));
    };

  if (fetching) return <LinearProgress />;

  return (
        <FormControl className={classes.formControl}>
            <InputLabel id="metric-select">Select Metric</InputLabel>
            <Select
                labelId="metric-select"
                id="metric-select"
                multiple
                value={selectedMetrics}
                onChange={handleChange}
                input={<Input />}
                MenuProps={MenuProps}
            >
                {metricsList.map((x: {value: string, label: string}, i) => (
                    <MenuItem key={i} value={x.value} style={utils.getStyles(x.value, selectedMetrics, theme)}>
                        {x.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
  );
};

export default MetricsContainer;
