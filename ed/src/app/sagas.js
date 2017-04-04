import request from 'superagent'
import {takeLatest, put} from 'redux-saga/effects';

import {actions, requestProfileSuccess, requestProfileFailure} from './ducks';

import {API_RW_ENDPOINT} from '../conf';

function * getProfile() {
  const url = `${API_RW_ENDPOINT}/profile`;
  try {
    const res = yield request.get(url)
      .withCredentials();
    yield put(requestProfileSuccess(res.body));
  } catch(err) {
    yield put(requestProfileFailure(err));
  }
}

export default function * appSaga() {
  yield takeLatest(actions.REQUEST_PROFILE, getProfile);
}
