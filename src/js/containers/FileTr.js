// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { connect } from 'react-redux'

// Custom
import { Tr } from 'uikit/Table'
import fileTable from 'models/fileTable'

/*----------------------------------------------------------------------------*/

const FileTr = ({ node, style, tableColumns }) => {
  const data = fileTable
    .slice()
    .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
    .filter(x => tableColumns.includes(x.id))

  return (
    <Tr style={style}>
      {data.map(x => x.td(node))}
    </Tr>
  )
}

FileTr.propTypes = {
  node: PropTypes.object,
  style: PropTypes.object,
  tableColumns: PropTypes.array,
}

/*----------------------------------------------------------------------------*/

export { FileTr }

export default Relay.createContainer(
  connect(state => ({ tableColumns: state.activeFileTableColumns }))(FileTr), {
    fragments: {
      node: () => Relay.QL`
        fragment on File {
          file_id
          file_name
          file_size
          access
          data_category
          data_format
          cases {
            project {
              project_id
            }
          }
        }
      `,
    },
  }
)
