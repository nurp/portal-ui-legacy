// Vendor
import React, { PropTypes } from 'react'
import { createComponent } from 'react-fela'
import Color from 'color'

// Custom
import theme from 'theme'
import { center, margin } from 'theme/mixins'

/*----------------------------------------------------------------------------*/

const button = ({ style }) => ({
  ...center,
  position: 'relative',
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
  ...style,
})

const B = createComponent(button, 'button')

const Button = ({ style, children, rightIcon, leftIcon, ...props }) => (
  <B style={style} {...props}>
    {leftIcon}
    <span style={{ ...margin(leftIcon, rightIcon), ...center }}>{children}</span>
    {rightIcon}
  </B>
)

Button.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
}

/*----------------------------------------------------------------------------*/

export default Button
