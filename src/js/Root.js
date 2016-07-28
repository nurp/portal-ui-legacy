// Vendor
import React from 'react';
import Relay from 'react-relay';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import useRelay from 'react-router-relay';
import { persistStore } from 'redux-persist'

// Custom
import * as reducers from 'dux';
import { toggleLoading } from 'dux/relayLoading';
import routes from './routes';

/*----------------------------------------------------------------------------*/

const store = createStore(combineReducers(reducers));

persistStore(store, { whitelist: ['cart'] }, () => {
   // Setup initial state - 2 tracks by default
  const state = STORE.getState();
   if (!state.phrase || state.phrase.past.length === 0 && state.phrase.present.tracks.length === 0) {
     STORE.dispatch(phraseCreateTrack())
     STORE.dispatch(phraseCreateTrack())
     STORE.dispatch(UndoActions.clearHistory())
   }
 })

// Don't inject everytime file is hot-reloaded
if (!Relay.Store._storeData._networkLayer._implementation) {
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(`${__API__}graphql`)
  );
}

const Root = () => (
  <Provider store={store}>
    <Router
      history={browserHistory}
      routes={routes}
      onReadyStateChange={readyState => {
        console.log(99, readyState);
        if (!readyState.done) store.dispatch(toggleLoading(true));
        else store.dispatch(toggleLoading(false));
      }}
      render={applyRouterMiddleware(useRelay)}
      environment={Relay.Store}
    />
  </Provider>
);

/*----------------------------------------------------------------------------*/

export default Root;
export { store };
