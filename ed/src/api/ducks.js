import {combineReducers} from 'redux';
import moment from 'moment';
import {merge, isEqual} from 'lodash';

import {itemTypes, REQUEST_CACHE_SIZE} from '../conf'


/*
 * Actions
 */
export const actions = {
  FETCH_LIST_REQUEST: "ed/api/list/request",
  FETCH_LIST_SUCCESS: "ed/api/list/success",
  FETCH_LIST_ERROR: "ed/api/list/error",
  FETCH_ENTITY_REQUEST: "ed/api/entity/request",
  FETCH_ENTITY_SUCCESS: "ed/api/entity/success",
  FETCH_ENTITY_ERROR: "ed/api/entity/error",
  PATCH_ENTITY_REQUEST: "ed/api/patch/request",
  PATCH_ENTITY_SUCCESS: "ed/api/patch/success",
  PATCH_ENTITY_ERROR: "ed/api/patch/error",
  PUT_ENTITY_REQUEST: "ed/api/put/request",
  PUT_ENTITY_SUCCESS: "ed/api/put/success",
  PUT_ENTITY_ERROR: "ed/api/put/error"
};


/*
 * Action creators
 */
export function fetchListRequest(itemType, filter) {
  return {
    type: actions.FETCH_LIST_REQUEST,
    itemType, filter,
  };
}

export function fetchListSuccess(itemType, filter, items) {
  return {
    type: actions.FETCH_LIST_SUCCESS,
    itemType, filter, items,
    when: moment()
  };
}

export function fetchListError(itemType, filter, error) {
  return {
    type: actions.FETCH_LIST_ERROR,
    itemType, filter, error,
    when: moment()
  };
}

export function fetchEntityRequest(itemType, id) {
  return {
    type: actions.FETCH_ENTITY_REQUEST,
    itemType, id
  };
}

export function fetchEntitySuccess(itemType, id, item) {
  return {
    type: actions.FETCH_ENTITY_SUCCESS,
    itemType, id, item,
    when: moment()
  };
}

export function fetchEntityError(itemType, id, error) {
  return {
    type: actions.FETCH_ENTITY_ERROR,
    itemType, id, error,
    when: moment()
  };
}

export function patchEntityRequest(itemType, id, patch, options) {
  return {
    type: actions.PATCH_ENTITY_REQUEST,
    itemType, id, patch, options,
  };
}

export function patchEntitySuccess(itemType, id, patch, options, response) {
  return {
    type: actions.PATCH_ENTITY_SUCCESS,
    itemType, id, patch, options, response,
    when: moment()
  };
}

export function patchEntityError(itemType, id, patch, options, error) {
  return {
    type: actions.PATCH_ENTITY_ERROR,
    itemType, id, patch, options, error,
    when: moment()
  };
}

export function putEntityRequest(itemType, id, item, options) {
  return {
    type: actions.PUT_ENTITY_REQUEST,
    itemType, id, item, options,
  };
}

export function putEntitySuccess(itemType, id, item, options, response) {
  return {
    type: actions.PUT_ENTITY_SUCCESS,
    itemType, id, item, options, response,
    when: moment()
  };
}

export function putEntityError(itemType, id, item, options, error) {
  return {
    type: actions.PUT_ENTITY_ERROR,
    itemType, id, item, options, error,
    when: moment()
  };
}


/*
 * Reducers
 */

// utils
function extractFromRequestCache(requestCacheState, {itemType, filter}) {
  const index = getRequestIndex(requestCacheState, {itemType, filter});

  return index !== -1 ?
    [Object.assign({}, requestCacheState[index]), requestCacheState.slice(0, index).concat(requestCacheState.slice(index))] :
    [{description: {itemType, filter}}, requestCacheState.slice(0, REQUEST_CACHE_SIZE - 1)];
}

function getRequestIndex(requestCacheState, {itemType, filter}) {
  return requestCacheState.findIndex(({description}) => isEqual(description, {itemType, filter}));
}


function createEntityReducer(itemType) {
  return function entityReducer(state = {}, action) {
    // handle only itemType related events
    if (action.itemType !== itemType) {
      return state;
    }

    let items;
    switch (action.type) {
      case actions.FETCH_LIST_SUCCESS:
        items = Object.assign({}, state);
        for (let item of action.items) {
          items[item._id] = {pending: false, lastRequestSuccessful: true, payload: item, when: action.when};
        }
        return items;
      case actions.FETCH_ENTITY_REQUEST:
        return Object.assign({}, state, {
          [action.id]: Object.assign({}, state[action.id] || {}, {pending: true})
        });
      case actions.FETCH_ENTITY_SUCCESS:
        return Object.assign({}, state, {
          [action.item._id]: {pending: false, lastRequestSuccessful: true, payload: action.item, when: action.when}
        });
      case actions.FETCH_ENTITY_ERROR:
        return Object.assign({}, state, {
          [action.id]: Object.assign({}, state[action.id] || {}, {pending: false, lastRequestSuccessful: false})
        });
      case actions.PATCH_ENTITY_SUCCESS:
        items = Object.assign({}, state);
        items[action.id] = merge({}, items[action.id], {payload: action.patch});
        return items;
      default:
        return state;
    }
  }
}

const entityReducersMap = {};
for (let itemType of itemTypes) {
  entityReducersMap[itemType.value] = createEntityReducer(itemType.value);
}
const entitiesReducer = combineReducers(entityReducersMap);

function requestCacheReducer(state = [], action) {
  let preservedState, newItem;
  switch (action.type) {
    case actions.FETCH_LIST_REQUEST:
      [newItem, preservedState] = extractFromRequestCache(state, action);
      return [
        Object.assign(newItem, {pending: true}),
        ...preservedState
      ];
    case actions.FETCH_LIST_SUCCESS:
      [newItem, preservedState] = extractFromRequestCache(state, action);
      return [
        {
          description: {itemType: action.itemType, filter: action.filter},
          when: action.when,
          items: action.items.map((item) => item._id),
          pending: false,
          lastRequestSuccessful: true
        },
        ...preservedState
      ];
    case actions.FETCH_LIST_ERROR:
      [newItem, preservedState] = extractFromRequestCache(state, action);
      return [
        Object.assign(newItem, {lastRequestSuccessful: false}),
        ...preservedState
      ];
    default:
      return state;
  }
}

export default combineReducers({
  entities: entitiesReducer,
  requestCache: requestCacheReducer
})


/*
 * Selectors
 */

export function selectEntity(state, {itemType, id}) {
  return (state.entities[itemType] && state.entities[itemType][id]) || null;
}

export function selectList(state, requestDescription) {
  const index = getRequestIndex(state.requestCache, requestDescription);
  if(index === -1) {
    return null;
  }

  const cachedRequest = state.requestCache[index];

  const itemType = cachedRequest.description.itemType;
  return Object.assign(
    {},
    cachedRequest,
    {items: cachedRequest.items && cachedRequest.items.map((_id) => Object.assign({}, state.entities[itemType][_id].payload))}
  );
}
