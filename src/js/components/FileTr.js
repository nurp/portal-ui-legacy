import Relay from 'react-relay';
import { tr, td } from 'react-hyperscript-helpers';

const FileTr = ({ node }) => (
  tr([
    td(node.access),
    td(node.file_name),
    td(`${node.cases.length}`),
    td(`${[...new Set(node.cases.map(c => c.project.project_id))]}`),
    td(node.data_category),
    td(node.data_format),
    td(`${node.file_size}B`),
  ])
);

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
