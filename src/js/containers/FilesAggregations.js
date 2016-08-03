// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'

// Custom
import { fileFacets } from 'entities/fileFacets'
import TermFacet from 'components/TermFacet'
import FreeTextFacet from 'components/FreeTextFacet'

/*----------------------------------------------------------------------------*/

const docType = 'files'

const FilesAggregations = props => (
  <div>
    <FreeTextFacet
      title="File"
      placeholder="Search for File name or ID"
    />
    {fileFacets.filter(f => f.facetType === 'terms').map(f =>
      <TermFacet
        key={`${docType}.${f.name}`}
        field={`${docType}.${f.name}`}
        pathname={`/${docType}`}
        title={f.title}
        buckets={((props.aggregations[f.name] || {}).buckets || [])}
      />
    )}
  </div>
)

FilesAggregations.propTypes = {
  relay: PropTypes.object,
  aggregations: PropTypes.object,
}

export { FilesAggregations }

export default Relay.createContainer(FilesAggregations, {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on FilesAgg {
        access {
          buckets {
            doc_count
            key
          }
        }
        data_category {
          buckets {
            doc_count
            key
          }
        }
        data_format {
          buckets {
            doc_count
            key
          }
        }
        data_type {
          buckets {
            doc_count
            key
          }
        }
        experimental_strategy {
          buckets {
            doc_count
            key
          }
        }
        platform {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
})
