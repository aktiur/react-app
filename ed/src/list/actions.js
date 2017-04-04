export const actions = {
  LIST_REQUEST: "ed/list/request",
  LIST_REQUEST_ERROR: "ed/list/request/error",
  LIST_REQUEST_SUCCESS: "ed/list/request/success",
  LIST_REQUEST_LONG: "ed/list/request/long",
};


export function listRequest(itemType) {
  return {
    type: actions.LIST_REQUEST,
    itemType
  };
}

export function listRequestSuccess(itemType, items) {
  return {
    type: actions.LIST_REQUEST_SUCCESS,
    itemType,
    items
  }
}

export function listRequestError(itemType) {
  return {
    type: actions.LIST_REQUEST_ERROR,
    itemType
  }
}

export function listRequestLong(itemType) {
  return {
    type: actions.LIST_REQUEST_LONG,
    itemType
  }
}
