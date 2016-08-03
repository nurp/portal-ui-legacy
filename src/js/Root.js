// Vendor
import React from 'react'
import Relay from 'react-relay'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { applyRouterMiddleware, Router, browserHistory } from 'react-router'
import useRelay from 'react-router-relay'
import { persistStore } from 'redux-persist'

// Custom
import reducers from 'dux'
import { toggleLoading } from 'dux/relayLoading'
import routes from './routes'

/*----------------------------------------------------------------------------*/

const store = createStore(combineReducers(reducers), applyMiddleware(thunk))

persistStore(store, { whitelist: [
  'cart',
  'activeFileTableColumns',
  'activeAnnotationTableColumns',
] })

// Don't inject everytime file is hot-reloaded
if (!Relay.Store._storeData._networkLayer._implementation) {
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(`${__API__}graphql`)
  )
}

const Root = () => (
  <Provider store={store}>
    <Router
      history={browserHistory}
      routes={routes}
      onReadyStateChange={readyState => {
        console.log(99, readyState)
        if (!readyState.done) store.dispatch(toggleLoading(true))
        else store.dispatch(toggleLoading(false))
      }}
      render={applyRouterMiddleware(useRelay)}
      environment={Relay.Store}
    />
  </Provider>
)

/*----------------------------------------------------------------------------*/

export default Root
export { store }
