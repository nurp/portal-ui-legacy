import { Route } from 'react-router'
import { h } from 'react-hyperscript-helpers'

import CartPage from 'containers/CartPage'
import { prepareViewerParams } from 'routes/utils'
import { viewerQuery } from 'routes/queries'

const CartRoute = h(Route, {
  path: '/cart',
  component: CartPage,
  prepareParams: prepareViewerParams,
  queries: viewerQuery,
})

export default CartRoute
