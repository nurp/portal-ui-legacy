// Vendor
import React, { PropTypes } from 'react';
import Radium from 'radium';
import Color from 'color';

// Custom
import theme from 'theme';
import { center } from 'theme/mixins';

/*----------------------------------------------------------------------------*/

const styles = {
  button: {
    ...center,
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
  margin(left, right) {
    if (left) {
      return { marginLeft: '0.5rem' };
    } else if (right) {
      return { marginRight: '0.5rem' };
    }
    return {};
  },
};

const Button = ({ style, children, rightIcon, leftIcon, ...props }) => (
  <button style={{ ...styles.button, ...style }} {...props}>
    {leftIcon}
    <span style={{ ...styles.margin(leftIcon, rightIcon), ...center }}>{children}</span>
    {rightIcon}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
};

/*----------------------------------------------------------------------------*/

export default Radium(Button);
