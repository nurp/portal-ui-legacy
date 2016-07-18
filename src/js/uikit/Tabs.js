import React, { Children, cloneElement, PropTypes } from 'react';
import Radium from 'radium';
import { Row, Column } from 'uikit/Flex';
import theme from 'theme';
import Color from 'color';

const borderStyle = `1px solid ${theme.greyScale4}`;

const tabBorder = {
  borderLeft: borderStyle,
  borderRight: borderStyle,
  borderTop: borderStyle,
};

const baseTabStyle = {
  padding: '1.2rem 1.8rem',
  fontSize: '1.5rem',
  color: '#000',
  textDecoration: 'none',
  borderTop: '1px solid transparent',
  borderLeft: '1px solid transparent',
  borderBottom: '1px solid transparent',
  borderRight: '1px solid transparent',
  backgroundColor: theme.greyScale5,
  marginBottom: '-1px',
  transition: 'background-color 0.2s ease',
  borderRadius: '4px 4px 0 0',
};

const styles = {
  tab: {
    ...baseTabStyle,
    ':hover': {
      textDecoration: 'none',
      color: '#000',
      backgroundColor: Color(theme.greyScale5).darken(0.05).rgbString(),
      ...tabBorder,
    },
  },
  active: {
    ...baseTabStyle,
    backgroundColor: '#fff',
    zIndex: 2,
    ...tabBorder,
  },
  margin: {
    marginLeft: '0.4rem',
  },
  content: {
    border: borderStyle,
    backgroundColor: '#fff',
  },
};

const Tabs = ({
  activeComponent,
  activeIndex,
  style,
  tabs,
}) => (
  <Column style={style}>
    <Row>
      {Children.map(tabs, (child, i) => cloneElement(child, {
        style: {
          ...(i === activeIndex ? styles.active : styles.tab),
          ...(i ? styles.margin : {}),
        },
      }))}
    </Row>
    <Column style={styles.content}>{activeComponent}</Column>
  </Column>
);

Tabs.propTypes = {
  activeComponent: PropTypes.element,
  activeIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  style: PropTypes.object,
  tabs: PropTypes.node,
};

export default Radium(Tabs);
