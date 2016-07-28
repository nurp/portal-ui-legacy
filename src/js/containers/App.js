// Vendor
import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import { connect } from 'react-redux';

// Custom
import { Column } from 'uikit/Flex';
import Overlay from 'uikit/Overlay';
import Header from 'components/Header';
import Footer from 'components/Footer';
import global from 'theme/global';

/*----------------------------------------------------------------------------*/

const styles = {
  wrapper: {
    minHeight: '100vh',
  },
};

const App = props => (
  <div>
    <Style rules={global} />
    <Overlay show={props.relayLoading}>TODO: Insert loading spinner / message here</Overlay>
    <Column style={styles.wrapper}>
      <Header />
      {props.children}
      <Footer config={{}} />
    </Column>
  </div>
);

App.propTypes = {
  children: PropTypes.node,
  relayLoading: PropTypes.bool,
};

/*----------------------------------------------------------------------------*/

export default Radium(connect(state => ({ relayLoading: state.relayLoading }))(App));
