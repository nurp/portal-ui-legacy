import { Route } from 'react-router'
import { h } from 'react-hyperscript-helpers'

import CartPage from 'containers/CartPage'
import { viewerQuery } from 'routes/queries'

const CartRoute = h(Route, {
  path: '/cart',
  component: CartPage,
  queries: viewerQuery,
})

export default CartRoute
