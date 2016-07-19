import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as L, withRouter } from 'react-router';
import Tabs from 'uikit/Tabs';

const Link = Radium(L);

const FileFacets = ({
  location,
  Aggregations,
}) => (
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
);

FileFacets.propTypes = {
  location: PropTypes.object,
  Aggregations: PropTypes.object,
};

export default withRouter(FileFacets);
