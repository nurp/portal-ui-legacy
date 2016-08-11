// Vendor
import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Radium from 'radium'
import LoginIcon from 'react-icons/lib/fa/sign-in'
import Color from 'color'

// Custom
import theme from 'theme'
import { center } from 'theme/mixins'

/*----------------------------------------------------------------------------*/

const openAuthWindow = ({ location }) => {
  const config = { auth: '' }
  if (navigator.cookieEnabled) {
    const returningPath = `${location.pathname}?${+new Date}`
    const redirectUrl = `${config.auth}?next=${returningPath}`

    const closeLogin = url => (
      url === redirectUrl
        ? false
        : url.includes(returningPath)
    )

    const win = open(redirectUrl, 'Auth', 'width=800, height=600')

    const interval = setInterval(() => {
      try {
        // Because the login window redirects to a different domain, checking
        // win.document in IE11 throws exceptions right away, which prevents
        // #clearInterval from ever getting called in this block.
        // Must check this block (if the login window has been closed) first!
        if (win.closed) {
          clearInterval(interval)
        } else if (closeLogin(win.document.URL)) {
          win.close()

          setTimeout(() => {
            clearInterval(interval)
            // UserService.login() // dispatch
          }, 1000)
        }
      } catch (err) {
        console.log('Error while monitoring the Login window: ', err)
      }
    }, 500)
  } else {
    // show cookie needs to be enabled message
  }
}

const styles = {
  link: {
    color: 'white',
    padding: '10px 13px',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
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

const LoginButton = props => (
  <span style={styles.link} onClick={() => openAuthWindow(props)}>
    <LoginIcon style={styles.faded} />
    <span style={styles.marginLeft}>Login</span>
  </span>
)

 /*----------------------------------------------------------------------------*/

export default connect()(withRouter(Radium(LoginButton)))
