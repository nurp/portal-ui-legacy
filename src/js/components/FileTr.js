import Relay from 'react-relay';
import { tr, td } from 'react-hyperscript-helpers';

const FileTr = ({ file }) => (
  tr([
    td(file.access),
    td(file.file_name),
    td(`${file.cases.length}`),
    td(`${[...new Set(file.cases.map(c => c.project.project_id))]}`),
    td(file.data_category),
    td(file.data_format),
    td(`${file.file_size}B`),
  ])
);

export default Relay.createContainer(FileTr, {
  fragments: {
    file: () => Relay.QL`
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
