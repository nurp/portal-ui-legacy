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
  console.log('asdasdas route', props)
  const Aggregations = {
    Cases: <CasesAggregations aggregations={props.viewer.cases.aggregations}
      setAutocomplete={quicksearch => props.relay.setVariables({ quicksearch })}/>,
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
    quicksearch: '',
    sort: '',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cases {
          aggregations(filters: $filters) {
            ${CasesAggregations.getFragment('aggregations')}
          }
          hits(first: 5, quicksearch: $quicksearch) {
            edges {
              node {
                id
                case_id
                project {
                  project_id
                  primary_site
                }
              }
            }
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
