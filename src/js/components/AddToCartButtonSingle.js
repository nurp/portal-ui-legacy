// Vendor
import React from 'react'
import ShoppingCartIcon from 'react-icons/lib/fa/shopping-cart'

// Custom
import Button from 'uikit/Button'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  button: {
    padding: '3px 5px',
    margin: '0 auto',
    background: 'white',
    color: theme.greyScale2,
    border: `1px solid ${theme.greyScale4}`,
    ':hover': {
      background:
        'linear-gradient(to bottom, #ffffff 50%, #e6e6e6 100%) repeat scroll 0 0 #e6e6e6',
    },
  },
}

const AddToCartButtonSingle = () => (
  <Button style={styles.button}>
    <ShoppingCartIcon />
  </Button>
)

/*----------------------------------------------------------------------------*/

export default AddToCartButtonSingle
