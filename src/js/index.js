import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import { AppContainer } from 'react-hot-loader';

import Root from './Root';

// Don't inject everytime file is hot-reloaded
if (!Relay.Store._storeData._networkLayer._implementation) {
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer('http://localhost:5000/graphql')
  );
}

ReactDOM.render(
  <AppContainer><Root /></AppContainer>,
  document.getElementById('react-relay-example')
);

if (module.hot) {
  module.hot.accept(Root, () => {
    ReactDOM.render(
      <AppContainer><Root /></AppContainer>,
      document.getElementById('react-relay-example')
    );
  });
}
