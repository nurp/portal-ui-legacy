import 'babel-polyfill';
import ReactDOM from 'react-dom';
import { h } from 'react-hyperscript-helpers';
import Relay from 'react-relay';

import App from 'components/App';
import AppHomeRoute from 'routes/AppHomeRoute';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:5000/graphql')
);

ReactDOM.render(
  h(Relay.RootContainer, {
    Component: App,
    route: new AppHomeRoute(),
  }),
  document.getElementById('react-relay-example')
);
