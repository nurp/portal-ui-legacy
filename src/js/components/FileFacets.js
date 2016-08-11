// Vendor
import React, { PropTypes } from 'react'
import { Link, withRouter } from 'react-router'

// Custom
import Tabs from 'uikit/Tabs'

/*----------------------------------------------------------------------------*/

const FileFacets = ({
  location,
  Aggregations: { Cases, Files },
}) => (
  <Tabs
    tabs={[
      <Link
        key="tab1"
        to={{ pathname: '/files', query: { ...location.query, facetTab: 'cases' } }}
      >
        Cases
      </Link>,
      <Link
        key="tab2"
        to={{ pathname: '/files', query: { ...location.query, facetTab: 'files' } }}
      >
        Files
      </Link>,
    ]}
    activeIndex={location.query.facetTab === 'cases' ? 0 : 1}
  >
    {location.query.facetTab === 'cases' ? Cases : Files}
  </Tabs>
)

FileFacets.propTypes = {
  location: PropTypes.object,
  Aggregations: PropTypes.object,
}

export default withRouter(FileFacets)
