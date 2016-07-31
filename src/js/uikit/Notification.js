// Vendor
import React, { PropTypes } from 'react'
import { compose, withState, shouldUpdate, mapProps } from 'recompose'
import CloseIcon from 'react-icons/lib/md/close'

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
  id: PropTypes.string,
  visible: PropTypes.bool,
  action: PropTypes.string,
  close: PropTypes.func,
  delay: PropTypes.number,
}

let timeoutId
let pageload = true

const enhance = compose(
  withState('visible', 'setState', false),
  shouldUpdate((props, nextProps) => {
    // Do not render on the first prop update, such as store rehydration
    if (pageload) {
      pageload = false
      return false
    }

    // Do not render if no children
    if (!nextProps.children) return false

    // Do not render if the notification is not up and its children don't change.
    // This catches prop changes that should not affect the notification
    if (props.id === nextProps.id &&
      (!props.visible && !nextProps.visible)) {
      return false
    }

    function startTimer() {
      timeoutId = setTimeout(() => {
        props.setState(() => false)
      }, props.delay || 5000)
    }

    // If the notification is not up, pop it up and begin the removal timeout
    if (!props.visible && !nextProps.visible) {
      props.setState(() => true)
      startTimer()
    }

    // If notification is up, refresh timeout when id changes
    if (props.visible && props.id !== nextProps.id) {
      clearTimeout(timeoutId)
      startTimer()
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

/*----------------------------------------------------------------------------*/

export default enhance(Notification)
