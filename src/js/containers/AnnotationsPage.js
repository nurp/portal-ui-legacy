// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'

// Custom
import SearchPage from 'components/SearchPage'
import AnnotationTable from 'containers/AnnotationTable'
import AnnotationsAggregations from 'containers/AnnotationsAggregations'

/*----------------------------------------------------------------------------*/

const AnnotationsPage = ({ viewer }) => {
  const Facets = <AnnotationsAggregations aggregations={viewer.annotations.aggregations} />
  const Results = <AnnotationTable hits={viewer.annotations.hits} />

  return (
    <SearchPage
      Facets={Facets}
      Results={Results}
    />
  )
}

AnnotationsPage.propTypes = {
  viewer: PropTypes.object,
}

export { AnnotationsPage }

export default Relay.createContainer(AnnotationsPage, {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        annotations {
          aggregations(filters: $filters) {
            ${AnnotationsAggregations.getFragment('aggregations')}
          }
          hits(first: $first offset: $offset, filters: $filters) {
            ${AnnotationTable.getFragment('hits')}
          }
        }
      }
    `,
  },
})
