import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import App from 'containers/App';

import ContainersRoute from 'routes/ContainersRoute';

export default (
  h(Route, {
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/containers/tags') },
    children: [
      ContainersRoute,
    ],
  })
);
