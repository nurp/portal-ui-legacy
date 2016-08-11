// Vendor
import React from 'react'
import Radium from 'radium'
import { Link as L } from 'react-router'
import AnnotationIcon from 'react-icons/lib/fa/align-left'
import FileIcon from 'react-icons/lib/fa/file-text'
import Color from 'color'

// Custom
import { Row } from 'uikit/Flex'
import theme from 'theme'
import { center } from 'theme/mixins'
import CartLink from 'components/CartLink'
import LoginButton from 'components/LoginButton'

/*----------------------------------------------------------------------------*/

const Link = Radium(L)

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
      backgroundColor: Color(theme.greyScale2).darken(0.5).rgbString(),
    },
    ...center,
  },
  faded: {
    color: 'rgb(191, 191, 191)',
  },
  marginLeft: {
    marginLeft: '0.7rem',
  },
}

const Nav = () => (
  <Row style={styles.nav}>
    <Row flex="1" />
    <Row flex="1">
      <Link to="/files" style={styles.link}>
        <FileIcon style={styles.faded} />
        <span style={styles.marginLeft}>Files</span>
      </Link>
      <Link to="/annotations" style={styles.link}>
        <AnnotationIcon style={styles.faded} />
        <span style={styles.marginLeft}>Annotations</span>
      </Link>
    </Row>
    <Row>
      <LoginButton />
      <CartLink />
    </Row>
  </Row>
)

/*----------------------------------------------------------------------------*/

export default Radium(Nav)
