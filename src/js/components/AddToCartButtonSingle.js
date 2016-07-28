// Vendor
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import ShoppingCartIcon from 'react-icons/lib/fa/shopping-cart'
import Color from 'color'

// Custom
import { toggleInCart } from 'dux/cart'
import Button from 'uikit/Button'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  button: {
    padding: '3px 5px',
    margin: '0 auto',
    border: `1px solid ${theme.greyScale4}`,
  },
  inactive: {
    backgroundColor: 'white',
    color: theme.greyScale2,
    ':hover': {
      backgroundColor: theme.greyScale5,
    },
  },
  active: {
    backgroundColor: 'green',
    color: 'white',
    ':hover': {
      backgroundColor: Color('green').darken(0.3).rgbString(),
    },
  },
}

const fileInCart = (files, file) => files.some(f => f.file_id === file.file_id)

const AddToCartButtonSingle = ({ dispatch, file, files, ...props }) => (
  <Button
    style={{ ...styles.button, ...(fileInCart(files, file) ? styles.active : styles.inactive) }}
    onClick={() => dispatch(toggleInCart(file))}
    {...props}
  >
    <ShoppingCartIcon />
  </Button>
)

AddToCartButtonSingle.propTypes = {
  files: PropTypes.array,
  file: PropTypes.object,
  dispatch: PropTypes.func,
}

/*----------------------------------------------------------------------------*/

export default connect(state => state.cart)(AddToCartButtonSingle)
