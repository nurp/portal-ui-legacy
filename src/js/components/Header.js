import React from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { Row, Column } from 'uikit/Flex';
import theme from 'theme';
import { center } from 'theme/mixins';
import Color from 'color';
import Nav from 'components/Nav';

const styles = {
  header: {
    borderTop: `6px solid ${theme.primary}`,
  },
  top: {
    background: 'linear-gradient(to bottom, #fefefe 0%, #c7c7c7 100%)',
    padding: '15px 0',
    height: '90px',
  },
  copy: {
    fontSize: '1.2rem',
  },
  logo: {
    background: 'url(/src/images/NIH-GDC-Legacy-Archive.svg) no-repeat 10px 7px',
    minWidth: '275px',
    height: '47px',
    textIndent: '-10000px',
    marginRight: '15px',
    padding: '20px',
  },
  activePortalLink: {
    backgroundColor: theme.primary,
    padding: '7px',
    color: '#fff',
    borderRadius: '5px',
    margin: '0 2rem 0 auto',
    display: 'flex',
    fontSize: '1.5rem',
    transition: 'background-color 0.2s ease',
    textDecoration: 'none',
    ':hover': {
      color: '#fff',
      textDecoration: 'none',
      backgroundColor: Color(theme.primary).lighten(0.5).rgbString(),
    },
  },
  activePortalLogo: {
    background: 'url("/src/images/GDC-App-data-portal.svg") no-repeat 0 0',
    height: '40px',
    width: '4rem',
    textIndent: '-10000px',
    marginRight: '15px',
    display: 'inline-block',
  },
};

const Header = () => (
  <Column style={styles.header}>
    <Row style={styles.top}>
      <Row flex="9">
        <Link to="/" style={styles.logo}>GDC Legacy Archive</Link>
        <span style={styles.copy}>
          The legacy data is the original data that uses the old genome build hg19
          as produced by the original submitter. The legacy data is not actively
          being updated in any way. Users should migrate to the harmonized data.
          <br />
          Please visit the <a href="https://gdc-portal.nci.nih.gov/">GDC Data Portal</a>.
        </span>
      </Row>
      <Row flex="3" style={center}>
        <a href="https://gdc-portal.nci.nih.gov/" style={styles.activePortalLink}>
          <i style={styles.activePortalLogo} />
          <Column>
            <Row>Launch the</Row>
            <Row><strong>GDC Data Portal</strong></Row>
          </Column>
        </a>
      </Row>
    </Row>
    <Nav />
  </Column>
);

export default Radium(Header);
