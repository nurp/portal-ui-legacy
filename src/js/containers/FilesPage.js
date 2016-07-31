// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'

// Custom
import CasesAggregations from 'containers/CasesAggregations'
import FilesAggregations from 'containers/FilesAggregations'
import FileTable from 'containers/FileTable'
import FileFacets from 'components/FileFacets'
import SearchPage from 'components/SearchPage'

/*----------------------------------------------------------------------------*/

const FilesPage = props => {
  const Aggregations = {
    Cases: <CasesAggregations aggregations={props.viewer.cases.aggregations} />,
    Files: <FilesAggregations aggregations={props.viewer.files.aggregations} />,
  }

  const Results = <FileTable hits={props.viewer.files.hits} />
  const Facets = <FileFacets Aggregations={Aggregations} />

  return (
    <SearchPage
      Facets={Facets}
      Results={Results}
    />
  )
}

FilesPage.propTypes = {
  viewer: PropTypes.object,
}

export { FilesPage }

export default Relay.createContainer(FilesPage, {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
    sort: '',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cases {
          aggregations(filters: $filters) {
            ${CasesAggregations.getFragment('aggregations')}
          }
        }
        files {
          aggregations(filters: $filters) {
            ${FilesAggregations.getFragment('aggregations')}
          }
          hits(first: $first, offset: $offset, filters: $filters, sort: $sort) {
            ${FileTable.getFragment('hits')}
          }
        }
      }
    `,
  },
})
