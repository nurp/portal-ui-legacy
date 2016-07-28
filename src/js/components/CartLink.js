// Vendor
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link as L } from 'react-router'
import Radium from 'radium'
import ShoppingCartIcon from 'react-icons/lib/fa/shopping-cart'
import Color from 'color'

// Custom
import theme from 'theme'
import { center } from 'theme/mixins'

/*----------------------------------------------------------------------------*/

const Link = Radium(L)

const styles = {
  link: {
    color: 'white',
    padding: '10px 13px',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: Color(theme.greyScale2).darken(0.5).rgbString(),
    },
    ...center,
  },
  faded: {
    color: 'rgb(191, 191, 191)',
  },
  fileLength: {
    marginLeft: '0.5rem',
    padding: '0.4rem 0.6rem',
    fontSize: '1rem',
    backgroundColor: '#5b5151',
  },
}

const CartLink = ({ files }) => (
  <Link to="/cart" style={styles.link}>
    <ShoppingCartIcon style={styles.faded} />
    <span style={{ marginLeft: '0.7rem' }}>Cart</span>
    <span style={styles.fileLength}>{files.length}</span>
  </Link>
)

CartLink.propTypes = {
  files: PropTypes.array,
}

/*----------------------------------------------------------------------------*/

export default connect(state => state.cart)(CartLink)
