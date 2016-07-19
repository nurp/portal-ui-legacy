import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Row, Column } from 'uikit/Flex';
import Card from 'uikit/Card';
import SearchResultsHeader from 'components/SearchResultsHeader';

const paginationMax = 20;

const SearchResults = ({
  type,
  total,
  count,
  Pagination,
  Table,
}) => (
  <Card>
    <Column>
      <Row style={{ padding: '1rem' }}>
        <SearchResultsHeader
          type={type}
          count={count}
          total={total}
          Pagination={Pagination}
        />
      </Row>
      <Row>{Table}</Row>
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
  count: PropTypes.number,
  Pagination: PropTypes.node,
  Table: PropTypes.node,
};

export default withRouter(SearchResults);
