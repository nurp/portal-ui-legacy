// Vendor
import React, { PropTypes } from 'react';

// Custom
import { Row } from 'uikit/Flex';
import theme from 'theme';

/*----------------------------------------------------------------------------*/

const styles = {
  alert: {
    marginBottom: '2rem',
    alignItems: 'center',
    padding: '2rem',
    fontSize: '1.5rem',
    color: 'black',
    backgroundColor: theme.greyScale4,
  },
};

const Info = ({ children, style }) => (
  <Row style={{ ...styles.alert, ...style }}>
    {children}
  </Row>
);

Info.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};

export default Info;
