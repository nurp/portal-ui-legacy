// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { connect } from 'react-redux'

// Custom
import { Tr } from 'uikit/Table'
import annotationTable from 'entities/annotationTable'

/*----------------------------------------------------------------------------*/

const AnnotationTr = ({ node, style, tableColumns }) => {
  const data = annotationTable
    .slice()
    .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
    .filter(x => tableColumns.includes(x.id))

  return (
    <Tr style={style}>
      {data.map(x => x.td(node))}
    </Tr>
  )
}

AnnotationTr.propTypes = {
  node: PropTypes.object,
  style: PropTypes.object,
  tableColumns: PropTypes.array,
}

export default Relay.createContainer(
  connect(state => ({ tableColumns: state.tableColumns.annotations }))(AnnotationTr), {
    fragments: {
      node: () => Relay.QL`
        fragment on Annotation {
          annotation_id
          case_id
          project {
            project_id
          }
          entity_type
          entity_id
          category
          classification
          created_datetime
        }
      `,
    },
  }
)
