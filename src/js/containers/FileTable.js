import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import FileTBody from 'containers/FileTBody';
import Pagination from 'containers/Pagination';
import SearchResults from 'components/SearchResults';
import Table from 'components/Table';
//
const FileTable = ({ hits }) => {
  const TableComponent = (
    <Table
      columns={[
        'Access',
        'Name',
        'Cases',
        'Projects',
        'Category',
        'Format',
        'Size',
      ]}
      body={<FileTBody edges={hits.edges} />}
    />
  );

  return (
    <SearchResults
      type="files"
      total={hits.pagination.total}
      count={hits.pagination.count}
      Table={TableComponent}
      Pagination={<Pagination pathname="/files" pagination={hits.pagination} />}
    />
  );
};

FileTable.propTypes = {
  hits: PropTypes.object,
};

export { FileTable };

export default Relay.createContainer(FileTable, {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    hits: () => Relay.QL`
      fragment on FileConnection {
        pagination {
          count
          total
          ${Pagination.getFragment('pagination')}
        }
        edges {
          ${FileTBody.getFragment('edges')}
        }
      }
    `,
  },
});
