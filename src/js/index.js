import 'babel-polyfill';
import ReactDOM from 'react-dom';
import { h } from 'react-hyperscript-helpers';
import Relay from 'react-relay';

import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import useRelay from 'react-router-relay';

import routes from './routes';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:5000/graphql')
);

ReactDOM.render(
  h(Router, {
    history: browserHistory,
    routes,
    onReadyStateChange: readyState => {
      console.log(99, readyState);
    },
    render: applyRouterMiddleware(useRelay),
  }),
  document.getElementById('react-relay-example')
);

// h(Relay.RootContainer, {
//   Component: App,
//   route: new AppHomeRoute(),
// }),
