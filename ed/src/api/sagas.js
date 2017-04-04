import {takeEvery, call, put} from 'redux-saga/effects';



import {apiClient, itemTypesMap} from '../conf'

import {
  actions,
  fetchListSuccess,
  fetchListError,
  fetchEntitySuccess,
  fetchEntityError,
  patchEntitySuccess,
  patchEntityError,
  putEntitySuccess,
  putEntityError
} from './ducks';

function * fetchList(action) {
  try {
    const apiName = itemTypesMap[action.itemType].apiName;
    const apiResource = apiClient[apiName];
    const items = yield call([apiResource, apiResource.find], action.filter || null);
    yield put(fetchListSuccess(action.itemType, action.filter, items))
  } catch (err) {
    yield put(fetchListError(action.itemType, action.filter, err));
  }
}

export function * fetchEntity(action) {
  try {
    const apiName = itemTypesMap[action.itemType].apiName;
    const apiResource = apiClient[apiName];
    const item = yield call([apiResource, apiResource.get], action.id);
    yield put(fetchEntitySuccess(action.itemType, action.id, item));
  } catch (err) {
    yield put(fetchEntityError(action.itemType, action.id, err));
  }
}

export function * patchEntity(action) {
  try {
    const apiName = itemTypesMap[action.itemType].apiName;
    const apiResource = apiClient[apiName];
    const response = yield call([apiResource, apiResource.patch], action.id, action.patch, action.options);
    yield put(patchEntitySuccess(action.itemType, action.id, action.patch, action.options, response));
  } catch (err) {
    yield put(patchEntityError(action.itemType, action.id, action.patch, action.options, err));
  }
}

export function * putEntity(action) {
  try {
    const apiName = itemTypesMap[action.itemType].apiName;
    const apiResource = apiClient[apiName];
    const response = yield call([apiResource, apiResource.put], action.id, action.item, action.options);
    yield put(putEntitySuccess(action.itemType, action.id, action.patch, action.options, response));
  } catch (err) {
    yield put(putEntityError(action.itemType, action.id, action.patch, action.options, err));
  }
}


export default function * apiSaga() {
  yield takeEvery(actions.FETCH_LIST_REQUEST, fetchList);
  yield takeEvery(actions.FETCH_ENTITY_REQUEST, fetchEntity);
  yield takeEvery(actions.PATCH_ENTITY_REQUEST, patchEntity);
  yield takeEvery(actions.PUT_ENTITY_REQUEST, putEntity);
}
