import React from 'react';
import {connect} from 'react-redux';
import Spinner from 'react-spinkit';

import {fetchListRequest, selectList} from '../api/ducks';
import {selectUser} from '../app/ducks';

import {itemTypesMap} from '../conf';

import {notify} from '../messages/ducks';

import Header from './components/Header';
import RefreshButton from './components/RefreshButton';
import ListItem from './components/ListItem';


class List extends React.Component {

  requestFetch() {
    const {filter, itemType, fetchList} = this.props;
    fetchList(itemType, filter);
  }

  componentDidMount() {
    /*
     When mounting, start a new request if no request has ever been started or the previous request
     encountered an error
     */
    const {request} = this.props;

    if (request === null) {
      this.requestFetch();
    }
  }

  componentDidUpdate() {
    /*
     when updating the component, a new request is started only if no request has been started before
     This situation should not happen
     */
    const {request} = this.props;

    if (request === null) {
      this.requestFetch();
    }
  }

  render() {
    const {
      itemType,
      fetchList,
      query,
      notify,
      request
    } = this.props;

    const {labelPlural, label} = itemTypesMap[itemType];

    if (request === null || (!request.items && request.pending)) {
      return <Spinner spinnerName='three-bounce' noFadeIn/>;
    }

    if (!request.items && !request.lastRequestSuccessful) {
      return <div>Erreur de connexion.</div>
    }


    return (
      <div style={{position: 'relative'}}>
        <Header itemLabelPlural={labelPlural} lastSuccess={request.when}/>
        <RefreshButton fetchList={fetchList}/>
        {
          request.items.length
            ? <ul>
              { request.items.map((item) => <ListItem key={item._id} item={item} query={query} itemType={itemType}/>) }
            </ul>
            : <p>Vous n'avez pas de {label}</p>
        }
      </div>
    )
  }
}

function getFilter(itemType, user) {
  return {
    'contact.email': user.email
  };
}

function mapStateToProps(state, props) {
  const itemType = props.params.itemType;
  const user = selectUser(state.app);
  const filter = getFilter(itemType, user);
  const request = selectList(state.api, {itemType, filter});

  return {
    itemType,
    request,
    query: props.location.query,
    filter: filter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchList: (itemType, filter) => dispatch(fetchListRequest(itemType, filter)),
    notify: (message, messageType) => dispatch(notify(message, messageType))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
