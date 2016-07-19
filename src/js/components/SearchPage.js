import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Row, Column } from 'uikit/Flex';
import Button from 'uikit/Button';
import Info from 'uikit/Alerts/Info';
import theme from 'theme';
import LeftArrow from 'react-icons/lib/fa/long-arrow-left';
import ShoppingCartIcon from 'react-icons/lib/fa/shopping-cart';
import DownloadIcon from 'react-icons/lib/fa/download';

const styles = {
  facetsPanel: {
    width: theme.facetsPanelWidth,
  },
  facet: {
    backgroundColor: 'white',
  },
  content: {
    marginLeft: '18px',
    width: `calc(100% - ${theme.facetsPanelWidth})`,
  },
};

const Files = ({
  Results,
  Facets,
}) => (
  <Row flex="1">
    <Column style={styles.facetsPanel}>
      {Facets}
    </Column>

    <Column style={styles.content}>
      <Info>
        <LeftArrow />
        <span style={{ marginLeft: '0.6rem' }}>Start searching by selecting a facet</span>
      </Info>

      <Info>
        <Button><ShoppingCartIcon /> Add all files to the cart</Button>
        <Button style={{ marginLeft: '1rem' }}><DownloadIcon /> Download Manifest</Button>
      </Info>

      {Results}
    </Column>
  </Row>
);

Files.propTypes = {
  Results: PropTypes.node,
  Facets: PropTypes.node,
  location: PropTypes.object,
};

export default Radium(Files);
