// Vendor
import React, { Children, PropTypes } from 'react'
import Color from 'color'
import { createComponent } from 'react-fela'

// Custom
import { Row, Column } from 'uikit/Flex'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const borderStyle = `1px solid ${theme.greyScale4}`

const tabBorder = {
  borderLeft: borderStyle,
  borderRight: borderStyle,
  borderTop: borderStyle,
}

const baseTabStyle = {
  padding: '1.2rem 1.8rem',
  fontSize: '1.5rem',
  color: '#000',
  textDecoration: 'none',
  borderTop: '1px solid transparent',
  borderLeft: '1px solid transparent',
  borderBottom: '1px solid transparent',
  borderRight: '1px solid transparent',
  backgroundColor: theme.greyScale6,
  marginBottom: '-1px',
  transition: 'background-color 0.2s ease',
  borderRadius: '4px 4px 0 0',
  cursor: 'pointer',
}

const styles = {
  active: {
    ...baseTabStyle,
    backgroundColor: '#fff',
    zIndex: 2,
    ...tabBorder,
    ':hover': {
      backgroundColor: 'white',
    },
  },
  inactive: {
    ':hover': {
      textDecoration: 'none',
      color: '#000',
      backgroundColor: Color(theme.greyScale6).darken(0.05).rgbString(),
      ...tabBorder,
    },
  },
  margin: {
    marginLeft: '0.4rem',
  },
  content: {
    border: borderStyle,
    backgroundColor: '#fff',
  },
}

const tab = ({ active, sibling }) => ({
  ...baseTabStyle,
  ...(active ? styles.active : styles.inactive),
  ...(sibling ? styles.margin : {}),
})

const Tab = createComponent(tab, 'div')

const Tabs = ({
  style,
  tabs,
  activeIndex,
  children,
  ...props,
}) => (
  <Column style={style} {...props}>
    <Row>
      {Children.map(tabs, (child, i) =>
        <Tab active={i === activeIndex} sibling={i}>{child}</Tab>
      )}
    </Row>
    <Column style={styles.content}>{children}</Column>
  </Column>
)

Tabs.propTypes = {
  children: PropTypes.node,
  activeIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  style: PropTypes.object,
  tabs: PropTypes.node,
}

/*----------------------------------------------------------------------------*/

export default Tabs
