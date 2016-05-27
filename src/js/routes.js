import Relay from 'react-relay';
import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import App from 'components/App';
import FilesRoute from 'routes/FilesRoute';

const parseIntParam = (str, defaults) => (
  str ? Math.max(parseInt(str, 10), 0) : defaults
);

const parseJsonParam = (str, defaults) => (
  str ? JSON.parse(atob(str)) : defaults
);

export default (
  h(Route, {
    path: '/',
    component: App,
    queries: {
      viewer: () => Relay.QL`query { viewer }`,
    },
    children: [
      h(Route, {
        path: '/files',
        component: FilesRoute,
        prepareParams: (params, { location: { query } }) => ({
          offset: parseIntParam(query.offset, 0),
          first: parseIntParam(query.first, 20),
          filters: parseJsonParam(query.filters, null),
        }),
        queries: {
          viewer: () => Relay.QL`query { viewer }`,
        },
      }),
    ],
  })
);
