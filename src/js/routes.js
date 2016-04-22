import Relay from 'react-relay';
import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import App from 'components/App';
import FileTable from 'components/FileTable';

const parseIntParam = (str, defaults) => (
  str ? Math.max(parseInt(str, 10), 0) : defaults
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
        component: FileTable,
        queryParams: ['offset', 'first'],
        prepareParams: params => ({
          offset: parseIntParam(params.offset, 0),
          first: parseIntParam(params.first, 20),
        }),
        queries: {
          files: () => Relay.QL`query { files }`,
        },
      }),
    ],
  })
);
