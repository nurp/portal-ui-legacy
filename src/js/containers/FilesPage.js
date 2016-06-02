import Relay from 'react-relay';
import { div, h } from 'react-hyperscript-helpers';

import CaseAggregations from 'components/CaseAggregations';
import FileAggregations from 'components/FileAggregations';
import FileTable from 'components/FileTable';

export const FilesPage = props => (
  div([
    h(CaseAggregations, { aggregations: props.viewer.cases.aggregations }),
    h(FileAggregations, { aggregations: props.viewer.files.aggregations }),
    h(FileTable, { hits: props.viewer.files.hits }),
  ])
);

export default Relay.createContainer(FilesPage, {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Root {
        cases {
          aggregations(filters: $filters) {
            ${CaseAggregations.getFragment('aggregations')}
          }
        }
        files {
          aggregations(filters: $filters) {
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
