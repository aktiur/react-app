import React from 'react';
import ReactDOM from 'react-dom';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { reducer as formReducer } from 'redux-form';
import moment from 'moment';

import App from './app/App';
import './index.css';

// reducers
import appReducer from './app/ducks';
import apiReducer from './api/ducks';
import listReducer from './list/reducers';
import editorReducer from './editor/ducks';
import messagesReducer from './messages/ducks';

// sagas
import appSaga from './app/sagas';
import apiSaga from './api/sagas';
import editorSaga from './editor/sagas';

moment.locale('fr');

const reducer = combineReducers({
  app: appReducer,
  api: apiReducer,
  list: listReducer,
  editor: editorReducer,
  form: formReducer,
  messages: messagesReducer
});

const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(loggerMiddleware, sagaMiddleware)
);

sagaMiddleware.run(appSaga);
sagaMiddleware.run(apiSaga);
sagaMiddleware.run(editorSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
