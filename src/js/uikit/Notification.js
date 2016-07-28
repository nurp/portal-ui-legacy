// Vendor
import React, { PropTypes } from 'react'
import { compose, withState, shouldUpdate, mapProps } from 'recompose'
import C from 'react-icons/lib/md/close'
import Radium from 'radium'

// Custom
import { center, zDepth1 } from 'theme/mixins'

/*----------------------------------------------------------------------------*/

const CloseIcon = Radium(C)

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
    position: 'relative',
    padding: '1.5rem',
    width: '40rem',
    borderRadius: '10px',
    pointerEvents: 'all',
    ...zDepth1,
  },
  closeIcon: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    cursor: 'pointer',
    ':hover': {
      color: 'red',
    },
  },
}

const Notification = ({ style, visible, action, close, children }) => (
  <div
    style={{
      ...styles.container,
      ...(visible ? styles.active : styles.inactive),
      ...style,
    }}
  >
    <div style={{ ...styles.toast, ...(styles[action] || styles.add) }}>
      <CloseIcon style={styles.closeIcon} onClick={close} />
      {children}
    </div>
  </div>
)

Notification.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
  visible: PropTypes.bool,
  action: PropTypes.string,
  close: PropTypes.func,
}

let timeoutId
let pageload = true

const enhance = compose(
  withState('visible', 'setState', false),
  shouldUpdate((props, nextProps) => {
    console.log('...', props, nextProps)
    if (pageload) {
      pageload = false
      return false
    }

    if (!nextProps.children) return false

    if (props.children === nextProps.children &&
      (!props.visible && !nextProps.visible)) {
      return false
    }

    if (!props.visible && !nextProps.visible) {
      props.setState(() => true)
      timeoutId = setTimeout(() => {
        props.setState(() => false)
      }, 3000)
    }

    return true
  }),
  mapProps(({ setState, ...rest }) => ({
    close: () => {
      setState(() => false)
      if (timeoutId) clearTimeout(timeoutId)
    },
    ...rest,
  }))
)

export default enhance(Notification)
