import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import { Row, Column } from 'uikit/Flex'

const SearchResultsHeader = ({ type, total, count, location }) => (
  <Row flex="1">
    <Column>
      <h2>{type}</h2>
      <span>
        <span>Showing </span>
        <strong>
          {1 + (+location.query.offset || 0)} - {(+location.query.offset + count) || 20}
        </strong>
        <span> of</span>
        <strong> {total.toLocaleString()}</strong> {type}
      </span>
    </Column>
    <Row style={{ marginLeft: 'auto' }}>
      <button>Sort</button>
      <button>arrange columns</button>
      <button>export</button>
    </Row>
  </Row>
)

SearchResultsHeader.propTypes = {
  count: PropTypes.number,
  type: PropTypes.string,
  total: PropTypes.number,
  location: PropTypes.object,
}

export default withRouter(SearchResultsHeader)
