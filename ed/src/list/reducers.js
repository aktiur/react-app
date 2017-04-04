import {combineReducers} from 'redux';
import moment from 'moment';

import * as actions from './actions';
import {itemTypes} from '../conf'

export const REQUEST_STATUS_NONE = "none";
export const REQUEST_STATUS_PROGRESS = "progress";
export const REQUEST_STATUS_LONG = "long";
export const REQUEST_STATUS_SUCCESS = "success";
export const REQUEST_STATUS_ERROR = "error";

const initialState = {
  lastRequestStatus: REQUEST_STATUS_NONE,
  lastSuccess: null,
  items: [],
};

function createReducer(itemType) {
  return function commonlistReducer(state = initialState, action) {
    if (action.itemType !== itemType) { return state; }
    switch (action.type) {
      case actions.LIST_REQUEST:
        return Object.assign({}, state, {lastRequestStatus: REQUEST_STATUS_PROGRESS});
      case actions.LIST_REQUEST_SUCCESS:
        return Object.assign({}, state, {
          lastRequestStatus: REQUEST_STATUS_SUCCESS,
          lastSuccess: moment(),
          items: action.items
        });
      case actions.LIST_REQUEST_ERROR:
        return Object.assign({}, state, {lastRequestStatus: REQUEST_STATUS_ERROR});
      case actions.LIST_REQUEST_LONG:
        return Object.assign({}, state, {lastRequestStatus: REQUEST_STATUS_LONG});
      default:
        return state;
    }
  }
}

const reducerMaps = {};
for (let itemType of itemTypes) {
  reducerMaps[itemType.value] = createReducer(itemType.value);
}

const listReducer = combineReducers(reducerMaps);
export default listReducer;
