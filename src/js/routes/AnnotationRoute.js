import Relay from 'react-relay';
import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import AnnotationPage from 'containers/AnnotationPage';

const AnnotationRoute = h(Route, {
  path: '/annotations/:id',
  component: AnnotationPage,
  prepareParams: (params) => ({
    id: btoa(`Annotation:${params.id}`),
  }),
  queries: {
    node: () => Relay.QL`query { node(id: $id) }`,
  },
});

export default AnnotationRoute;
