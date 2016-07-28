// Vendor
import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'

// Custom
import { Row, Column } from 'uikit/Flex'
import Card from 'uikit/Card'
import SearchResultsHeader from 'components/SearchResultsHeader'
import SearchResultsFooter from 'components/SearchResultsFooter'

/*----------------------------------------------------------------------------*/

const styles = {
  headerContainer: {
    padding: '1rem',
  },
  tableContainer: {
    overflow: 'scroll',
  },
}

const SearchResults = ({
  type,
  total,
  count,
  Pagination,
  Table,
}) => (
  <Card>
    <Column>
      <Row style={styles.headerContainer}>
        <SearchResultsHeader
          type={type}
          count={count}
          total={total}
          Pagination={Pagination}
        />
      </Row>
      <Row style={styles.tableContainer}>{Table}</Row>
      <SearchResultsFooter Pagination={Pagination} />
    </Column>
  </Card>
)

SearchResults.propTypes = {
  type: PropTypes.string,
  total: PropTypes.number,
  count: PropTypes.number,
  Pagination: PropTypes.node,
  Table: PropTypes.node,
}

export default withRouter(SearchResults)
