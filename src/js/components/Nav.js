import React from 'react';
import Radium from 'radium';
import { Link as L } from 'react-router';
import { Row } from 'uikit/Flex';
import theme from 'theme';
import { center } from 'theme/mixins';
import Color from 'color';

const Link = Radium(L);

const styles = {
  nav: {
    backgroundColor: theme.greyScale2,
    height: '36px',
    justifyContent: 'center',
  },
  link: {
    color: 'white',
    padding: '10px 13px',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: Color(theme.$greyScale2).darken(0.5).rgbString(),
    },
    ...center,
  },
};

const Nav = () => (
  <Row style={styles.nav}>
    <Row flex="1" />
    <Row flex="1">
      <Link to="/files" style={styles.link}>Files</Link>
      <Link to="/annotations" style={styles.link}>Annotations</Link>
    </Row>
    <Row>
      <a style={styles.link}>Login</a>
      <Link to="/cart" style={styles.link}>Cart</Link>
    </Row>
  </Row>
);

export default Radium(Nav);
