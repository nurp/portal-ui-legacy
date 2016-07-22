// Vendor
import React, { PropTypes } from 'react';
import Radium from 'radium';
import Color from 'color';

// Custom
import theme from 'theme';

/*----------------------------------------------------------------------------*/

const styles = {
  button: {
    cursor: 'pointer',
    padding: '6px 12px',
    fontSize: '14px',
    borderRadius: '4px',
    backgroundColor: theme.primary,
    color: 'white',
    border: '1px solid transparent',
    transition: '0.25s ease',
    ':hover': {
      backgroundColor: Color(theme.primary).lighten(0.3).rgbString(),
    },
  },
};

const Button = ({ style, children, ...props }) => (
  <button style={{ ...styles.button, ...style }} {...props}>{children}</button>
);

Button.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

/*----------------------------------------------------------------------------*/

export default Radium(Button);
