// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'

// Custom
import { fileFacets } from 'models/fileFacets'
import TermFacet from 'components/TermFacet'

/*----------------------------------------------------------------------------*/

const docType = 'files'

const FilesAggregations = props => (
  <div>
    {fileFacets.filter(f => f.facetType === 'terms').map(f =>
      <TermFacet
        key={`${docType}.${f.name}`}
        pathname={`/${docType}`}
        title={f.title}
        params={props.relay.route.params}
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
