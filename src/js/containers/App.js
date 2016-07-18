import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import { Row, Column } from 'uikit/Flex';
import Header from 'components/Header';
import Footer from 'components/Footer';
import global from 'theme/global';

const styles = {
  wrapper: {
    minHeight: '100vh',
  },
  main: {
    padding: '2rem 2rem 13rem 2rem',
  },
};

const App = ({ children }) => (
  <Column style={styles.wrapper}>
    <Style rules={global} />
    <Header />
    <Row style={styles.main}>{children}</Row>
    <Footer config={{}} />
  </Column>
);

App.propTypes = {
  children: PropTypes.node,
};

export default Radium(App);
