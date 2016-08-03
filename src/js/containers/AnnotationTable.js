// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import { connect } from 'react-redux'

// Custom
import Table, { Th } from 'uikit/Table'
import AnnotationTBody from 'containers/AnnotationTBody'
import Pagination from 'containers/Pagination'
import SearchResults from 'components/SearchResults'
import annotationTable from 'models/annotationTable'

/*----------------------------------------------------------------------------*/

const AnnotationTable = ({ hits, tableColumns }) => {
  return null
  // const headings = annotationTable
  //   .slice()
  //   .sort((a, b) => tableColumns.indexOf(a.id) - tableColumns.indexOf(b.id))
  //   .filter(x => tableColumns.includes(x.id))
  //
  // const TableComponent = (
  //   <Table
  //     headings={headings.map(x => x.th || <Th key={x.id}>{x.name}</Th>)}
  //     body={<AnnotationTBody edges={hits.edges} />}
  //   />
  // )
  //
  // return (
  //   <SearchResults
  //     type="annotations"
  //     total={hits.pagination.total}
  //     count={hits.pagination.count}
  //     Table={TableComponent}
  //     Pagination={<Pagination pathname="/annotations" pagination={hits.pagination} />}
  //   />
  // )
}

AnnotationTable.propTypes = {
  hits: PropTypes.object,
  tableColumns: PropTypes.array,
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
