import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as L, withRouter } from 'react-router';
import { Row, Column } from 'uikit/Flex';
import Button from 'uikit/Button';
import Tabs from 'uikit/Tabs';
import Info from 'uikit/Alerts/Info';
import theme from 'theme';
import LeftArrow from 'react-icons/lib/fa/long-arrow-left';
import ShoppingCartIcon from 'react-icons/lib/fa/shopping-cart';
import DownloadIcon from 'react-icons/lib/fa/download';

const Link = Radium(L);

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
  Aggregations,
  Results,
  location,
}) => (
  <Row flex="1">
    <Column style={styles.facetsPanel}>
      <Tabs
        tabs={[
          <Link key="tab1" to="/files?facetTab=cases">Cases</Link>,
          <Link key="tab2" to="/files?facetTab=files">Files</Link>,
        ]}
        activeIndex={
          location.query.facetTab === 'cases' ? 0 : 1
        }
        activeComponent={
          location.query.facetTab === 'cases'
            ? Aggregations.Cases
            : Aggregations.Files
        }
      />
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
  Aggregations: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  location: PropTypes.object,
};

export default withRouter(Radium(Files));
