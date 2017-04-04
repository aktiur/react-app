import React from 'react';
import {connect} from 'react-redux';

import './MessageBox.css';

import Message from './Message';
import {hide} from './ducks';

function MessageBox({messages, hider}) {
  return <div id="messagebox">
    {
      messages.map(({id, messageType, message, delay}) => (
        <Message key={message.id} messageType={messageType} messageHide={hider(id)} delay={delay} >
          {message}
        </Message>
      ))
    }
  </div>
}

function mapStateToProps({messages}) {
  return {
    messages
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hider: (messageId) => () => dispatch(hide(messageId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox);
