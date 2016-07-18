import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as L, withRouter } from 'react-router';
import { Row, Column } from 'uikit/Flex';
import Tabs from 'uikit/Tabs';
import Info from 'uikit/Alerts/Info';
import theme from 'theme';

const Link = Radium(L);

const styles = {
  facetsPanel: {
    width: theme.facetsPanelWidth,
  },
  facet: {
    backgroundColor: 'white',
  },
  content: {
    marginLeft: '30px',
    width: `calc(100% - ${theme.facetsPanelWidth})`,
  },
};

const Files = ({
  Aggregations,
  ResultsTable,
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
        <i style="fa fa-long-arrow-left" />
        Start searching by selecting a facet
      </Info>

      {ResultsTable}
    </Column>
  </Row>
);

Files.propTypes = {
  ResultsTable: PropTypes.node,
  Aggregations: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  location: PropTypes.object,
};

export default withRouter(Radium(Files));
