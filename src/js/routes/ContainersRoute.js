import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import ContainersPage from 'containers/ContainersPage';
import { prepareViewerParams } from 'routes/utils';
import { viewerQuery } from 'routes/queries';

import TagsRoute from 'routes/TagsRoute';

const ContainersRoute = h(Route, {
  path: '/containers',
  component: ContainersPage,
  prepareParams: prepareViewerParams,
  queries: viewerQuery,
  children: [
    TagsRoute,
  ],
});

export default ContainersRoute;
