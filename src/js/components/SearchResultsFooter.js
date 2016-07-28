// Vendor
import React, { PropTypes } from 'react'

// Custom
import { Row } from 'uikit/Flex'

/*----------------------------------------------------------------------------*/

const paginationMax = 20

const styles = {
  container: {
    padding: '1rem',
  },
  pagination: {
    marginLeft: 'auto',
  },
}

const SearchResultsFooter = ({ Pagination }) => (
  <Row style={styles.container}>
    <Row>Show <button>{paginationMax} ^</button> results</Row>
    <Row style={styles.pagination}>{Pagination}</Row>
  </Row>
)

SearchResultsFooter.propTypes = {
  Pagination: PropTypes.node,
}

export default SearchResultsFooter
