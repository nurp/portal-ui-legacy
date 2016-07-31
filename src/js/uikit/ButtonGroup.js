// Vendor
import React, { PropTypes, Children, cloneElement } from 'react'

// Custom
import { Row } from 'uikit/Flex'

/*----------------------------------------------------------------------------*/

const ButtonGroup = ({ style, children, ...props }) => (
  <Row style={style} {...props}>
    {Children.map(children, (child, i) =>
      cloneElement(child, {
        ...child.props,
        style: {
          ...child.props.style,
          borderRadius: // shouldn't have newlines
            `${!i ? '4px' : '0px'} `
          + `${i === children.length - 1 ? '4px' : '0px'} `
          + `${i === children.length - 1 ? '4px' : '0px'} `
          + `${!i ? '4px' : '0px'}`,
          ...(i ? { borderLeft: 'none' } : {}),
          display: 'inline',
        },
      })
    )}
  </Row>
)

ButtonGroup.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
}

/*----------------------------------------------------------------------------*/

export default ButtonGroup
