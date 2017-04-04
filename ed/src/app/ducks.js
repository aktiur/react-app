
export const actions = {
  REQUEST_PROFILE: "app/request",
  REQUEST_PROFILE_SUCCESS: "app/request/success",
  REQUEST_PROFILE_FAILURE: "app/request/failure"
};

export function requestProfile() {
  return {
    type: actions.REQUEST_PROFILE
  };
}

export function requestProfileSuccess(user) {
  return {
    type: actions.REQUEST_PROFILE_SUCCESS,
    user
  }
}

export function requestProfileFailure(error) {
  return {
    type: actions.REQUEST_PROFILE_FAILURE,
    error
  };
}

export default function appReducer(state = {user: null, error: null}, action) {
  switch (action.type) {
    case actions.REQUEST_PROFILE_SUCCESS:
      return Object.assign({}, state, {user: action.user});
    case actions.REQUEST_PROFILE_FAILURE:
      return Object.assign({}, state, {error: action.error});
    default:
      return state;
  }
};

export function selectUser(state) {
  return state.user;
}

export function selectLoginError(state) {
  return state.error;
}