import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import CasesAggregations from 'containers/CasesAggregations';
import FilesAggregations from 'containers/FilesAggregations';
import FileTable from 'containers/FileTable';

import SearchPage from 'components/SearchPage';

// export const FilesPage = props => (
//   div([
//     h(CasesAggregations, { aggregations: props.viewer.cases.aggregations }),
//     h(FilesAggregations, { aggregations: props.viewer.files.aggregations }),
//     h(FileTable, { hits: props.viewer.files.hits }),
//   ])
// );

const FilesPage = ({ viewer }) => {
  const Aggregations = {
    Cases: <CasesAggregations aggregations={viewer.cases.aggregations} />,
    Files: <FilesAggregations aggregations={viewer.files.aggregations} />,
  };

  const ResultsTable = <FileTable hits={viewer.files.hits} />;

  return (
    <SearchPage
      Aggregations={Aggregations}
      ResultsTable={ResultsTable}
    />
  );
};

FilesPage.propTypes = {
  viewer: PropTypes.object,
};

export { FilesPage };

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
            ${CasesAggregations.getFragment('aggregations')}
          }
        }
        files {
          aggregations(filters: $filters) {
            ${FilesAggregations.getFragment('aggregations')}
          }
          hits(first: $first offset: $offset, filters: $filters) {
            ${FileTable.getFragment('hits')}
          }
        }
      }
    `,
  },
});
