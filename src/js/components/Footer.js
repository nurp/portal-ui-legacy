import React, { PropTypes } from 'react';
import Radium from 'radium';
import theme from 'theme';
import Color from 'color';

const styles = {
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 100,
    height: 'auto',
    backgroundColor: theme.greyScale1,
    borderTop: `6px solid ${Color(theme.greyScale1).lighten(2).rgbString()}`,
    borderBottom: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerContainer: {
    fontSize: '85.714%',
    padding: '15px 0',
    color: '#97abb6',
    textAlign: 'center',
  },
  innerContainer: {
    margin: '5px auto 0',
    textAlign: 'center',
  },
  link: {
    color: '#c2cfd5',
  },
};

const Footer = ({
  config,
}) => (
  <footer style={styles.footer}>
    <div style={styles.outerContainer} role="contentinfo">
      <div style={styles.innerContainer}>
        <a href="/" style={styles.link}>Site Home</a>
        <span> | </span>
        <a href="http://www.cancer.gov/global/web/policies" style={styles.link}>Policies</a>
        <span> | </span>
        <a href="http://www.cancer.gov/global/web/policies/accessibility" style={styles.link}>Accessibility</a>
        <span> | </span>
        <a href="http://www.cancer.gov/global/web/policies/foia" style={styles.link}>FOIA</a>
      </div>
      <div style={styles.innerContainer}>
        <a href="http://www.hhs.gov" style={styles.link}>U.S. Department of Health and Human Services</a>
        <span> | </span>
        <a href="http://www.nih.gov" style={styles.link}>National Institutes of Health</a>
        <span> | </span>
        <a href="http://www.cancer.gov" style={styles.link}>National Cancer Institute</a>
        <span> | </span>
        <a href="http://www.usa.gov" style={styles.link}>USA.gov</a>
      </div>
      <div style={styles.innerContainer}>
        NIH... Turning Discovery Into Health &#174;
      </div>
      <div style={styles.innerContainer}>
        <span> UI </span>
        <a href={config.tag} style={styles.link}>{config.version}</a>
        <span> @ </span>
        <a href={config.commitLink} style={styles.link}>{config.commitHash}</a>
        <span>, API </span>
        <a href={config.apiTag} style={styles.link}>{config.apiVersion}</a>

        {
          config.apiCommitHash &&
            <span>
              <span> @ </span>
              <a href={config.apiCommitLink} style={styles.link}>
                {config.apiCommitHash.slice(0, 7)}
              </a>
            </span>
        }
      </div>
    </div>
  </footer>
);

Footer.propTypes = {
  config: PropTypes.object,
};

export default Radium(Footer);
