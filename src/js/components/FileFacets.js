import React, { PropTypes } from 'react'
import Radium from 'radium'
import { Link as L, withRouter } from 'react-router'
import Tabs from 'uikit/Tabs'

const Link = Radium(L)

const links = [
  <Link key="tab1" to="/files?facetTab=cases">Cases</Link>,
  <Link key="tab2" to="/files?facetTab=files">Files</Link>,
]

const FileFacets = ({
  location,
  Aggregations: { Cases, Files },
}) => (
  <Tabs
    tabs={links}
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
