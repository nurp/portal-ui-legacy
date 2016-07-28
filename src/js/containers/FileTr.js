// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'

// Custom
import { Tr } from 'uikit/Table'
import model from 'models/fileTable'

/*----------------------------------------------------------------------------*/

const FileTr = ({ node, style }) => (
  <Tr style={style}>
    {model.map(x => x.td(node))}
  </Tr>
)


FileTr.propTypes = {
  node: PropTypes.object,
  style: PropTypes.object,
}

/*----------------------------------------------------------------------------*/

export { FileTr }

export default Relay.createContainer(FileTr, {
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
})
