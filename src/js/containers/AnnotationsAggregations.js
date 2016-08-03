// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'

// Custom
import { annotationFacets } from 'entities/annotationFacets'
import TermFacet from 'components/TermFacet'
import FreeTextFacet from 'components/FreeTextFacet'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const docType = 'annotations'

const styles = {
  container: {
    backgroundColor: 'white',
    border: `1px solid ${theme.greyScale4}`,
  },
}

export const AnnotationsAggregations = props => (
  <div style={styles.container}>
    <FreeTextFacet
      title="File"
      placeholder="Search for File name or ID"
    />
    {annotationFacets.filter(f => f.facetType === 'terms').map(f =>
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

AnnotationsAggregations.propTypes = {
  relay: PropTypes.object,
  aggregations: PropTypes.object,
}

export default Relay.createContainer(AnnotationsAggregations, {
  fragments: {
    aggregations: () => Relay.QL`
      fragment on AnnotationsAgg {
        category {
          buckets {
            doc_count
            key
          }
        }
        classification {
          buckets {
            doc_count
            key
          }
        }
        entity_type {
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
        project__program__name {
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
        status {
          buckets {
            doc_count
            key
          }
        }
      }
    `,
  },
})
