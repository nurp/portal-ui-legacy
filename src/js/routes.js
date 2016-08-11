// Vendor
import React from 'react'
import { Route } from 'react-router'

// Custom
import App from 'containers/App'
import FilesRoute from 'routes/FilesRoute'
import FileRoute from 'routes/FileRoute'
import AnnotationsRoute from 'routes/AnnotationsRoute'
import AnnotationRoute from 'routes/AnnotationRoute'
import CartRoute from 'routes/CartRoute'

/*----------------------------------------------------------------------------*/

const props = {
  path: '/',
  component: App,
  children: [
    FilesRoute,
    FileRoute,
    AnnotationRoute,
    AnnotationsRoute,
    CartRoute,
  ],
  indexRoute: {
    onEnter: (nextState, replace) => replace('/files'),
  },
}

/*----------------------------------------------------------------------------*/

export default <Route {...props} />
