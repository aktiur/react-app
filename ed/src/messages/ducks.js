const uuid = require('uuid');

export const NOTIFY = 'ed/messages/notify';
export const HIDE = 'ed/messages/hide';

export function notify(message, messageType, delay = 5) {
  return {
    type: NOTIFY,
    id: uuid(),
    message,
    messageType,
    delay
  }
}

export function hide(id) {
  return {
    type: HIDE,
    id
  }
}

function messagesReducer(state = [], action) {
  switch (action.type) {
    case NOTIFY:
      return [...state, {id: action.id, message: action.message, messageType: action.messageType, delay: action.delay}];
    case HIDE:
      return state.filter(({id}) => id !== action.id);
    default:
      return state;
  }
}

export default messagesReducer;
