// Vendor
import React from 'react'
import Radium from 'radium'

/*----------------------------------------------------------------------------*/

const rotate = Radium.keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(359deg)' },
}, 'rotate')

const scale = Radium.keyframes({
  '0%': { transform: 'scale(0.0)' },
  '50%': { transform: 'scale(1.0)' },
  '100%': { transform: 'scale(0.0)' },
}, 'scale')

const styles = {
  spinParticleContainer: {
    position: 'fixed',
    width: '4rem',
    height: '4rem',
    left: '45%',
    top: '40%',
    display: 'block',
    animation: 'x 2s infinite linear',
    animationName: rotate,
    transition: 'all 0.3s ease',
  },
  particle: {
    width: '60%',
    height: '60%',
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    backgroundColor: '#000',
    borderRadius: '100%',
    animation: 'x 2s infinite ease-in-out',
    animationName: scale,
  },
  otherParticle: {
    top: 'auto',
    bottom: 0,
    animationDelay: '-1.0s',
  },
  otherOtherParticle: {
    top: 0,
    bottom: 'auto',
    marginLeft: '2.2rem',
    animationDelay: '-1.2s',
  },
  grey: {
    backgroundColor: '#6b6262',
  },
  red: {
    backgroundColor: '#c31547',
  },
  blue: {
    backgroundColor: '#123e57',
  },
}


const Particle = () => (
  <div style={styles.spinParticleContainer}>
    <div style={{ ...styles.particle, ...styles.red }}></div>
    <div style={{ ...styles.particle, ...styles.otherParticle, ...styles.grey }}></div>
    <div style={{ ...styles.particle, ...styles.otherOtherParticle, ...styles.blue }}></div>
  </div>
)

export default Radium(Particle)
