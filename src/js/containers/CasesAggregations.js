// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'

// Custom
import { caseFacets } from 'entities/caseFacets'
import TermFacet from 'components/TermFacet'
import FreeTextFacet from 'components/FreeTextFacet'

/*----------------------------------------------------------------------------*/

const docType = 'cases'

const CasesAggregations = ({ setAutocomplete, aggregations, hits }) => (
  <div>
    <FreeTextFacet
      title="Case"
      placeholder="Search for UUID, Submitter ID"
      hits={hits}
      setAutocomplete={setAutocomplete}
    />
    {caseFacets.filter(f => f.facetType === 'terms').map(f =>
      <TermFacet
        key={`${docType}.${f.name}`}
        field={`${docType}.${f.name}`}
        pathname={'/files'}
        title={f.title}
        buckets={((aggregations[f.name] || {}).buckets || [])}
      />
    )}
  </div>
)

CasesAggregations.propTypes = {
  aggregations: PropTypes.object,
  hits: PropTypes.object,
  setAutocomplete: PropTypes.func,
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
    hits: () => Relay.QL`
      fragment on CaseConnection {
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
    `,
  },
})
