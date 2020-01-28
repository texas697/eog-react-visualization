
import { reducer as metricsReducer } from '../containers/Metrics/reducer';
import { reducer as measurementsReducer } from '../containers/Chart/reducer';

export default {
  metrics: metricsReducer,
  measurements: measurementsReducer
};
