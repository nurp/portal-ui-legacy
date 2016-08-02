// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { connect } from 'react-redux'

// Custom
import FileTBody from 'containers/FileTBody'
import Pagination from 'containers/Pagination'
import SearchResults from 'components/SearchResults'
import Table, { Th } from 'uikit/Table'
import fileTable from 'models/fileTable'

/*----------------------------------------------------------------------------*/

const FileTable = props => {
  const headings = fileTable.filter(x => props.tableColumns.includes(x.id))

  const TableComponent = (
    <Table
      headings={headings.map(x => x.th || <Th key={x.id}>{x.name}</Th>)}
      body={<FileTBody edges={props.hits.edges} />}
    />
  )

  return (
    <SearchResults
      type="files"
      total={props.hits.pagination.total}
      count={props.hits.pagination.count}
      Table={TableComponent}
      Pagination={<Pagination pathname="/files" pagination={props.hits.pagination} />}
    />
  )
}

FileTable.propTypes = {
  hits: PropTypes.object,
  tableColumns: PropTypes.array,
}

/*----------------------------------------------------------------------------*/

export { FileTable }

export default Relay.createContainer(
  connect(state => ({ tableColumns: state.activeFileTableColumns }))(FileTable), {
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
  }
)
