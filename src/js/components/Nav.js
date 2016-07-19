import React from 'react';
import Radium from 'radium';
import { Link as L } from 'react-router';
import { Row } from 'uikit/Flex';
import theme from 'theme';
import { center } from 'theme/mixins';
import Color from 'color';
import ShoppingCartIcon from 'react-icons/lib/fa/shopping-cart';
import LoginIcon from 'react-icons/lib/fa/sign-in';

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
  faded: {
    color: 'rgb(191, 191, 191)',
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
      <a style={styles.link}>
        <LoginIcon style={styles.faded} />
        <span style={{ marginLeft: '0.7rem' }}>Login</span>
      </a>
      <Link to="/cart" style={styles.link}>
        <ShoppingCartIcon style={styles.faded} />
        <span style={{ marginLeft: '0.7rem' }}>Cart</span>
      </Link>
    </Row>
  </Row>
);

export default Radium(Nav);
