import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import TagsPage from 'containers/TagsPage';
import { prepareViewerParams } from 'routes/utils';
import { viewerQuery } from 'routes/queries';

const TagsRoute = h(Route, {
  path: '/containers/tags',
  component: TagsPage,
  prepareParams: prepareViewerParams,
  queries: viewerQuery,
});

export default TagsRoute;
