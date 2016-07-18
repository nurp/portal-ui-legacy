import React, { PropTypes } from 'react';
import { Row, Column } from 'uikit/Flex';
import Card from 'uikit/Card';

const pagination = {
  max: 20,
};

const SearchResults = ({
  type,
  total,
}) => (
  <Card>
    <Column>
      <Row>
        <Column>
          <h2>{type}</h2>
          <span>
            Showing <strong>1 - {pagination.max}</strong> of
            <strong> {total}</strong> {type}
          </span>
        </Column>
      </Row>
      <Row>
        <table>
          <thead>

          </thead>
          <tbody>

          </tbody>
        </table>
      </Row>
      <Row>
        <Row>
          Show <button>{pagination.max} ^</button> results
        </Row>
      </Row>
    </Column>
  </Card>
);

SearchResults.propTypes = {
  type: PropTypes.string,
  total: PropTypes.number,
};

export default SearchResults;
