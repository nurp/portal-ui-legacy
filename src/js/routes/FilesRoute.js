import Relay from 'react-relay';
import { div, h } from 'react-hyperscript-helpers';

import FileAggregations from 'components/FileAggregations';
import FileTable from 'components/FileTable';

export const FilesRoute = props => {
  console.log('FilesRoute', props);
  return div([
    h(FileAggregations, { aggregations: props.viewer.files.aggregations }),
    h(FileTable, { hits: props.viewer.files.hits }),
  ]);
};

export default Relay.createContainer(FilesRoute, {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        files {
          aggregations {
            ${FileAggregations.getFragment('aggregations')}
          }
          hits(first: $first offset: $offset, filters: $filters) {
            ${FileTable.getFragment('hits')}
          }
        }
      }
    `,
  },
});
