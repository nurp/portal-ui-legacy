import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Row, Column } from 'uikit/Flex';
import Card from 'uikit/Card';

const paginationMax = 20;

const SearchResults = ({
  type,
  total,
  count,
  Pagination,
  Table,
  location,
}) => (
  <Card>
    <Column>
      <Row>
        <Column>
          <h2>{type}</h2>
          <span>
            Showing <strong>{1 + (+location.query.offset || 0)} - {+location.query.offset + count}</strong> of
            <strong> {total.toLocaleString()}</strong> {type}
          </span>
        </Column>
      </Row>
      <Row>
        {Table}
      </Row>
      <Row>
        <Row>Show <button>{paginationMax} ^</button> results</Row>
        <Row style={{ marginLeft: 'auto' }}>{Pagination}</Row>
      </Row>
    </Column>
  </Card>
);

SearchResults.propTypes = {
  type: PropTypes.string,
  total: PropTypes.number,
};

export default withRouter(SearchResults);
