import Relay from 'react-relay';
import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import FilePage from 'containers/FilePage';

const FileRoute = h(Route, {
  path: '/files/:id',
  component: FilePage,
  prepareParams: (params) => ({
    id: btoa(`File:${params.id}`),
  }),
  queries: {
    node: () => Relay.QL`query { node(id: $id) }`,
  },
});

export default FileRoute;
