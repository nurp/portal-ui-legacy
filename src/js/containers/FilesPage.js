// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'

// Custom
import DownloadManifestButton from 'containers/DownloadManifestButton'
import CasesAggregations from 'containers/CasesAggregations'
import FilesAggregations from 'containers/FilesAggregations'
import FileTable from 'containers/FileTable'
import FileFacets from 'components/FileFacets'
import SearchPage from 'components/SearchPage'

/*----------------------------------------------------------------------------*/

const FilesPage = ({ viewer, relay }) => {
  console.log(1234, viewer)

  const setAutocomplete = quicksearch => relay.setVariables({
    quicksearch,
    runQuicksearch: !!quicksearch,
  })

  const Aggregations = {
    Cases:
      <CasesAggregations
        aggregations={viewer.cases.aggregations}
        hits={(viewer.cases || {}).hits || {}}
        setAutocomplete={setAutocomplete}
      />,
    Files:
      <FilesAggregations
        aggregations={viewer.files.aggregations}
        hits={(viewer.files || {}).hits || {}}
        setAutocomplete={setAutocomplete}
      />,
  }

  const Results = <FileTable hits={viewer.files.hits} />
  const Facets = <FileFacets Aggregations={Aggregations} />

  return (
    <SearchPage
      Facets={Facets}
      Results={Results}
      hits={viewer.files.hits}
    />
  )
}

FilesPage.propTypes = {
  viewer: PropTypes.object,
  relay: PropTypes.object,
}

export { FilesPage }

export default Relay.createContainer(FilesPage, {
  initialVariables: {
    first: 20,
    offset: 0,
    filters: null,
    quicksearch: '',
    sort: '',
    runQuicksearch: false,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cases {
          aggregations(filters: $filters) {
            ${CasesAggregations.getFragment('aggregations')}
          }
          hits(first: 5, quicksearch: $quicksearch) @include(if: $runQuicksearch) {
            ${CasesAggregations.getFragment('hits')}
          }
        }
        files {
          aggregations(filters: $filters) {
            ${FilesAggregations.getFragment('aggregations')}
          }
          hits(first: $first, offset: $offset, filters: $filters, sort: $sort) {
            ${DownloadManifestButton.getFragment('hits')}
            ${FileTable.getFragment('hits')}
          }
        }
      }
    `,
  },
})
