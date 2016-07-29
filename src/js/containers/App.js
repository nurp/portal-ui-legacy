// Vendor
import React, { PropTypes } from 'react'
import Radium, { Style, StyleRoot } from 'radium'
import { connect } from 'react-redux'

// Custom
import { Column } from 'uikit/Flex'
import Overlay from 'uikit/Overlay'
import Notification from 'uikit/Notification'
import Particle from 'uikit/Loaders/Particle'
import Header from 'components/Header'
import Footer from 'components/Footer'
import global from 'theme/global'

/*----------------------------------------------------------------------------*/

const styles = {
  wrapper: {
    minHeight: '100vh',
  },
}

const App = ({ relayLoading, notification, children }) => (
  <StyleRoot>
    <Style rules={global} />
    <Overlay show={relayLoading}><Particle /></Overlay>
    <Notification action={notification.action}>
      {notification.component}
    </Notification>
    <Column style={styles.wrapper}>
      <Header />
      {children}
      <Footer config={{}} />
    </Column>
  </StyleRoot>
)

App.propTypes = {
  children: PropTypes.node,
  relayLoading: PropTypes.bool,
  notification: PropTypes.object,
}

function mapStateToProps(state) {
  return {
    relayLoading: state.relayLoading,
    notification: state.notification,
  }
}

/*----------------------------------------------------------------------------*/

export default Radium(connect(mapStateToProps)(App))
