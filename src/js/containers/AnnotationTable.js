import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import AnnotationTBody from 'containers/AnnotationTBody'
import Pagination from 'containers/Pagination'
import SearchResults from 'components/SearchResults'
import Table from 'uikit/Table'

const AnnotationTable = ({ hits }) => {
  const TableComponent = (
    <Table
      columns={[
        'UUID',
        'Case UUID',
        'Project',
        'Entity Type',
        'Entity UUID',
        'Category',
        'Classification',
        'Date Created',
      ]}
      body={<AnnotationTBody edges={hits.edges} />}
    />
  )

  return (
    <SearchResults
      type="annotations"
      total={hits.pagination.total}
      count={hits.pagination.count}
      Table={TableComponent}
      Pagination={<Pagination pathname="/annotations" pagination={hits.pagination} />}
    />
  )
}

AnnotationTable.propTypes = {
  hits: PropTypes.object,
}

export { AnnotationTable }

export default Relay.createContainer(AnnotationTable, {
  initialVariables: {
    first: 0,
    offset: 0,
    filters: null,
  },
  fragments: {
    hits: () => Relay.QL`
      fragment on AnnotationConnection {
        pagination {
          count
          total
          ${Pagination.getFragment('pagination')}
        }
        edges {
          ${AnnotationTBody.getFragment('edges')}
        }
      }
    `,
  },
})
