import React from 'react';
import classNames from 'classnames';


class Message extends React.Component {
  componentDidMount() {
    const {messageHide, delay} = this.props;
    setTimeout(messageHide, delay*1000);
  }

  render() {
    const {messageType, messageHide, children} = this.props;
    return <div className={classNames('alert', 'alert-' + messageType)} role="alert">
      <button type="button" className="close" aria-label="Close" onClick={messageHide}>
        <span aria-hidden="true">&times;</span>
      </button>
      {children}
    </div>

  }
}

export default Message;
