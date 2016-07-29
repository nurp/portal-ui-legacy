import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { caseFacets } from 'models/caseFacets'
import TermFacet from 'components/TermFacet'

const docType = 'cases'

const CasesAggregations = props => (
  <div>
    {caseFacets.filter(f => f.facetType === 'terms').map(f =>
      <TermFacet
        key={`${docType}.${f.name}`}
        field={`${docType}.${f.name}`}
        pathname={'/files'}
        title={f.title}
        params={props.relay.route.params}
        buckets={((props.aggregations[f.name] || {}).buckets || [])}
      />
    )}
  </div>
)

CasesAggregations.propTypes = {
  relay: PropTypes.object,
  aggregations: PropTypes.object,
}

export default Relay.createContainer(CasesAggregations, {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on CasesAgg {
        demographic__ethnicity {
          buckets {
            doc_count
            key
          }
        }
        demographic__gender {
          buckets {
            doc_count
            key
          }
        }
        demographic__race {
          buckets {
            doc_count
            key
          }
        }
        diagnoses__vital_status {
          buckets {
            doc_count
            key
          }
        }
        project__disease_type {
          buckets {
            doc_count
            key
          }
        }
        project__primary_site {
          buckets {
            doc_count
            key
          }
        }
        project__project_id {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
})
