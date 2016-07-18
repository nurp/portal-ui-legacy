import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import CasesAggregations from 'containers/CasesAggregations';
import FilesAggregations from 'containers/FilesAggregations';
import FileTable from 'containers/FileTable';

import SearchPage from 'components/SearchPage';

const FilesPage = ({ viewer }) => {
  const Aggregations = {
    Cases: <CasesAggregations aggregations={viewer.cases.aggregations} />,
    Files: <FilesAggregations aggregations={viewer.files.aggregations} />,
  };

  const Results = <FileTable hits={viewer.files.hits} />;

  return (
    <SearchPage
      Aggregations={Aggregations}
      Results={Results}
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
