import React, { PropTypes } from 'react';
import { Row } from 'uikit/Flex';
import theme from 'theme';

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

const Info = ({ children }) => (
  <Row style={styles.alert}>
    {children}
  </Row>
);

Info.propTypes = {
  children: PropTypes.node,
};

export default Info;
