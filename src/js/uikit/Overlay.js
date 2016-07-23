// Vendor
import React, { PropTypes } from 'react';

/*----------------------------------------------------------------------------*/

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'opacity 0.35s ease',
  },
};

const Overlay = ({ children, style, ...props }) => (
  <div style={{ ...styles.container, ...style }} {...props}>
    {children}
  </div>
);

Overlay.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

/*----------------------------------------------------------------------------*/

export default Overlay;
