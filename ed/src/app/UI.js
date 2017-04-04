import React from 'react';
import Spinner from 'react-spinkit';
import {connect} from 'react-redux';

import Menu from '../menu/Menu';
import MessageBox from '../messages/MessageBox';

import {selectUser, selectLoginError, requestProfile} from './ducks';

class UI extends React.Component {

  componentDidMount() {
    const {user, loginError, loadUser} = this.props;

    if (user === null && loginError === null) {
      loadUser();
    }
  }

  render() {
    const {user, loginError, children, location} = this.props;
    const query = location.query;

    if (loginError) {
      return <div>Login Error !</div>
    }

    if (user === null) {
      return <Spinner spinnerName="three-bounce" noFadeIn/>;
    }

    return (
      <div>
        <MessageBox/>
        <Menu query={query} user={user}/>
        <div className="content">
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: selectUser(state.app),
  loginError: selectLoginError(state.app)
});

const mapDispatchToProps = dispatch => ({
  loadUser: () => dispatch(requestProfile())
});


export default connect(mapStateToProps, mapDispatchToProps)(UI);
