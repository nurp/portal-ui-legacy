import { Route } from 'react-router'
import { h } from 'react-hyperscript-helpers'

import FilesPage from 'containers/FilesPage'
import { prepareViewerParams } from 'routes/utils'
import { viewerQuery } from 'routes/queries'

const FilesRoute = h(Route, {
  path: '/files',
  component: FilesPage,
  prepareParams: prepareViewerParams,
  queries: viewerQuery,
  onEnter(nextState, replace) {
    // Select the case facet tab by default
    if (!nextState.location.query.facetTab) {
      replace({
        pathname: '/files',
        query: { facetTab: 'cases' },
      })
    }
  },
})

export default FilesRoute
