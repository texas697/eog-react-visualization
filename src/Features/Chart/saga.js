import { takeEvery, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { actions as chartActions } from './reducer';

function* apiErrorReceived(action) {
  yield call(toast.error, `Error Received: ${action.payload.error}`);
}

export default function* watchApiError() {
  yield takeEvery(chartActions.measurementsApiErrorReceived.type, apiErrorReceived);
}
