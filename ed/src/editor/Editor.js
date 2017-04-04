import React from 'react';
import {connect} from 'react-redux';
import Spinner from 'react-spinkit';

import {selectEntity, fetchEntityRequest} from '../api/ducks';

import {enterEditor, leaveEditor, submitForm} from './ducks';
import EventForm from './EventForm';
import GroupForm from './GroupForm';


function submitFormClosure({itemType, id, initial}) {
  return function(data, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch(submitForm({
        itemType,
        id,
        initial,
        data,
        defer: {resolve, reject},
      }));
    });
  };
}

function mapStateToProps(state, props) {
  const {itemType, id} = props.params;

  const entityRequest = selectEntity(state.api, {itemType, id});

  const {initial, entered} = state.editor[itemType];

  return {
    itemType,
    id,
    entityRequest: entityRequest,
    initial,
    entered,
    submitForm: submitFormClosure({itemType, id, initial})
  }
}

function mapDispatchToProps(dispatch, props) {
  const {itemType, id} = props.params;

  return {
    requestEntity: () => dispatch(fetchEntityRequest(itemType, id)),
    enterEditor: (item) => dispatch(enterEditor(itemType, item)),
    leaveEditor: () => dispatch(leaveEditor(itemType)),
  }
}

const components = {
  'evenements': EventForm,
  'groupes': GroupForm
};

class Editor extends React.Component {
  //  props: {
  // itemType e,
  // id: l'identifiant de l'élément,
  // item: la copie cachée de l'item telle qu'elle existe,
  // initial: la copie sur laquelle l'édition a démarrée,
  // request: y a-t-il une requête prévue ?,
  // entered: l'édition a-t-elle commencé ?
  // }

  dispatchAll(force = false) {
    const {entityRequest, entered, requestEntity, enterEditor} = this.props;

    if (!entityRequest || (!entityRequest.pending && !entityRequest.lastRequestSuccessful && force)) {
      requestEntity();
    }

    if (!entered && entityRequest && entityRequest.payload) {
      enterEditor(entityRequest.payload);
    }
  }

  // rajouter componentWillReceiveProps pour gérer le changement d'id

  componentDidMount() {
    this.dispatchAll(true);
  }

  componentDidUpdate() {
    this.dispatchAll();
  }

  componentWillUnmount() {
    this.props.leaveEditor();
  }

  render() {
    const {initial, entered, itemType, submitForm} = this.props;
    const Component = components[itemType];

    if (entered) {
      return <div className="container">
        <Component initialValues={initial} submitPatch={submitForm} />
      </div>
    } else {
      return <Spinner spinnerName='three-bounce' noFadeIn/>;
    }
  }
}

const connectedEditor = connect(mapStateToProps, mapDispatchToProps)(Editor);
export default connectedEditor;
