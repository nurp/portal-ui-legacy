// Vendor
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// Custom
import Root from './Root';

/*----------------------------------------------------------------------------*/

const rootEl = document.getElementById('react-relay-example');

ReactDOM.render(
  <AppContainer><Root /></AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept(Root, () => {
    ReactDOM.render(
      <AppContainer><Root /></AppContainer>,
      rootEl
    );
  });
}
