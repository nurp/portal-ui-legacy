import { h } from 'react-hyperscript-helpers';
import Relay from 'react-relay';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import useRelay from 'react-router-relay';

import routes from './routes';

const cRoutes = {
  ...routes,
};

const Root = () => (
  h(Router, {
    history: browserHistory,
    routes,
    onReadyStateChange: readyState => {
      console.log(99, readyState);
    },
    render: applyRouterMiddleware(useRelay),
    environment: Relay.Store,
  })
);

export default Root;
