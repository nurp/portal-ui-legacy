import { Route } from 'react-router';
import { h } from 'react-hyperscript-helpers';

import App from 'components/App';

import FilesRoute from 'routes/FilesRoute';
import AnnotationsRoute from 'routes/AnnotationsRoute';

export default (
  h(Route, {
    path: '/',
    component: App,
    children: [
      FilesRoute,
      AnnotationsRoute,
    ],
  })
);
