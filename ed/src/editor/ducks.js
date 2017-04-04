import {combineReducers} from 'redux';
import _ from 'lodash/lang'

import {itemTypes} from '../conf';

export const actions = {
  EDITOR_ENTER: "ed/editor/ENTER",
  EDITOR_LEAVE: "ed/editor/LEAVE",
  FORM_SUBMIT: "ed/editor/SUBMIT"
};

export function enterEditor(itemType, item) {
  return {
    type: actions.EDITOR_ENTER,
    itemType,
    item
  }
}

export function leaveEditor(itemType) {
  return {
    type: actions.EDITOR_LEAVE,
    itemType
  };
}

export function submitForm(payload) {
  return {
    type: actions.FORM_SUBMIT,
    ...payload
  };
}

const initialState = {
  initial: null,
  entered: false,
};

export function selectFormInformation(state, itemType){
  return state[itemType];
}

function createReducer(itemType) {
  return function commonEditorReducer(state = initialState, action) {
    if (action.itemType !== itemType) {
      return state;
    }

    switch (action.type) {
      case actions.EDITOR_ENTER:
        if (_.isEqual(state.item, action.item)) {
          return state;
        } else {
          return Object.assign({}, state, {initial: action.item, entered: true})
        }
      case actions.EDITOR_LEAVE:
        return Object.assign({}, state, {initial: null, entered: false});
      default:
        return state;
    }
  };
}

const reducerMaps = {};
for (let itemType of itemTypes) {
  reducerMaps[itemType.value] = createReducer(itemType.value);
}

const editorReducer = combineReducers(reducerMaps);
export default editorReducer;
