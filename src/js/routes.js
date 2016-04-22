import Relay from 'react-relay';
import { Route } from 'react-router';
import { div, h } from 'react-hyperscript-helpers';

import App from 'components/App';
import FileTable from 'components/FileTable';

export default (
  h(Route, {
    path: '/',
    component: App,
    renderLoading: () => div('beep!'),
    queries: {
      viewer: () => Relay.QL`query { viewer }`,
    },
    children: [
      h(Route, {
        path: '/files',
        component: FileTable,
        renderLoading: () => div('beep!!'),
        queryParams: ['offset', 'first'],
        prepareParams: params => ({
          offset: params.offset ? parseInt(params.offset, 10) : 0,
          first: params.first ? parseInt(params.first, 10) : 20,
        }),
        queries: {
          files: () => Relay.QL`query { files }`,
        },
      }),
    ],
  })
);
