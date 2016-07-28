// Vendor
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose, withState, shouldUpdate } from 'recompose'

// Custom
import { center, zDepth1 } from 'theme/mixins'

/*----------------------------------------------------------------------------*/

const styles = {
  container: {
    position: 'fixed',
    width: '100vw',
    zIndex: 10,
    margin: '1rem 0',
    transition: 'transform 0.25s ease',
    pointerEvents: 'none',
    ...center,
  },
  inactive: {
    transform: 'translateY(-140%)',
  },
  active: {
    transform: 'translateY(0)',
  },
  add: {
    color: '#3c763d',
    backgroundColor: '#dff0d8',
    border: '1px solid #d6e9c6',
  },
  remove: {
    color: '#773c63',
    backgroundColor: '#f0d8dd',
    border: '1px solid #e9c6c6',
  },
  toast: {
    padding: '1.5rem',
    width: '40rem',
    borderRadius: '15px',
    pointerEvents: 'all',
    ...zDepth1,
  },
}

const CartToast = ({ style, state }) => (
  <div
    style={{
      ...styles.container,
      ...(state.visible ? styles.active : styles.inactive),
      ...style,
    }}
  >
    <div style={{ ...styles.toast, ...(styles[state.action] || {}) }}>
      {state.message}
    </div>
  </div>
)

CartToast.propTypes = {
  style: PropTypes.object,
}

let timeoutId
let pageload = true

const enhance = compose(
  withState('state', 'setState', { visible: false, message: '', action: '' }),
  shouldUpdate((props, nextProps) => {
    if (pageload) {
      pageload = false
      return false
    }

    if (props.files.length > nextProps.files.length) {
      if (timeoutId) clearTimeout(timeoutId)

      if (!props.state.visible && !nextProps.state.visible) {
        props.setState(() => ({
          visible: true,
          action: 'remove',
          message: 'You removed a file',
        }))

        timeoutId = setTimeout(() =>
          props.setState(() => ({ visible: false, action: 'remove' }))
        , 3000)
      }
    } else if (props.files.length < nextProps.files.length) {
      if (timeoutId) clearTimeout(timeoutId)

      if (!props.state.visible && !nextProps.state.visible) {
        props.setState(() => ({
          visible: true,
          action: 'add',
          message: 'You added a file',
        }))

        timeoutId = setTimeout(() =>
          props.setState(() => ({ visible: false, action: 'add' }))
        , 3000)
      }
    }

    return true
  })
)

export default connect(state => state.cart)(enhance(CartToast))
