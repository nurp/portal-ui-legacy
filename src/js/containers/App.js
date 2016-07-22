// Vendor
import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';

// Custom
import { Row, Column } from 'uikit/Flex';
import Header from 'components/Header';
import Footer from 'components/Footer';
import global from 'theme/global';

/*----------------------------------------------------------------------------*/

const styles = {
  wrapper: {
    minHeight: '100vh',
  },
  main: {
    padding: '2rem 2.5rem 13rem',
  },
};

const App = props => (
  <Column style={styles.wrapper}>
    <Style rules={global} />
    <Header />
    <Row style={styles.main}>{props.children}</Row>
    <Footer config={{}} />
  </Column>
);

App.propTypes = {
  children: PropTypes.node,
};

/*----------------------------------------------------------------------------*/

export default Radium(App);
