import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Row, Column } from 'uikit/Flex';

const SearchResultsHeader = ({ type, total, count, location }) => (
  <Row>
    <Column>
      <h2>{type}</h2>
      <span>
        Showing
        <strong>
          {1 + (+location.query.offset || 0)} - {(+location.query.offset + count) || 20}
        </strong>
        of
        <strong> {total.toLocaleString()}</strong> {type}
      </span>
    </Column>
  </Row>
);

SearchResultsHeader.propTypes = {
  count: PropTypes.number,
  type: PropTypes.string,
  total: PropTypes.number,
  location: PropTypes.object,
};

export default withRouter(SearchResultsHeader);
