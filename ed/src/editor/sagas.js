import {takeLatest, take, put, call } from 'redux-saga/effects'
//import { SubmissionError } from 'redux-form';

import {isEqual} from 'lodash';

import {actions as apiActions, patchEntityRequest} from '../api/ducks';
import {actions as editorActions} from './ducks'

function isPojo (obj) {
  if (obj === null || typeof obj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(obj) === Object.prototype;
}

function getDifferences(base, modified) {
  const diff = {};

  for (let k of Object.keys(modified)) {
    if (!isEqual(base[k], modified[k])) {
      if(isPojo(modified[k])) {
        diff[k] = getDifferences(base[k], modified[k]);
      } else {
        diff[k] = modified[k];
      }
    }
  }
  return diff;
}

function * handleSubmit({itemType, id, initial, data, defer, options}) {
  const {resolve, reject} = defer;

  const patch = getDifferences(initial, data);

  const [action] = yield [
    take([apiActions.PATCH_ENTITY_SUCCESS, apiActions.PATCH_ENTITY_ERROR]),
    put(patchEntityRequest(itemType, id, patch, {...options, etag: initial._etag}))
  ];

  if (action.type === apiActions.PATCH_ENTITY_SUCCESS) {
    yield call(resolve, action.response);
  } else {
    yield call(reject, action.error);
  }
}

export default function * editorSaga() {
  yield takeLatest(editorActions.FORM_SUBMIT, handleSubmit);
}
