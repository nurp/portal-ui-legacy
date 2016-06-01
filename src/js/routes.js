import Relay from 'react-relay';
import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import App from 'components/App';


export default (
  h(Route, {
    path: '/',
    component: App,
    queries: {
      viewer: () => Relay.QL`query { viewer }`,
    },
    getChildRoutes(location, cb) {
      Promise.all([
        System.import('./routes/FilesRoute'),
      ]).then(modules => {
        cb(null, modules.map(m => m.default));
      }).catch(err => {
        console.error(`getChildRoutes: ${err} ${err.stack}`);
      });
    },
  })
);
