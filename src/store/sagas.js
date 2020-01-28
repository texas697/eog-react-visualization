import { spawn } from 'redux-saga/effects';
import metricsSaga from '../containers/Metrics/saga';
import measurementsSaga from '../containers/Chart/saga';

export default function* root() {
  yield spawn(metricsSaga);
  yield spawn(measurementsSaga);
}
