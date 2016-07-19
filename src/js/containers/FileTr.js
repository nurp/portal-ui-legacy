import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import Tr from 'uikit/Table/Tr';
import Td from 'uikit/Table/Td';

const FileTr = ({ node }) => (
  <Tr>
    <Td>{node.access}</Td>
    <Td>
      <Link to={{ pathname: `/files/${node.file_id}` }}>{node.file_name}</Link>
    </Td>
    <Td>{node.cases.length}</Td>
    <Td>{[...new Set(node.cases.map(c => c.project.project_id))]}</Td>
    <Td>{node.data_category}</Td>
    <Td>{node.data_format}</Td>
    <Td>{node.file_size}B</Td>
  </Tr>
);

FileTr.propTypes = {
  node: PropTypes.object,
};

export { FileTr };

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
});
