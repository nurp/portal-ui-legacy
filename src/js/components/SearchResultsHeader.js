// Vendor
import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'
import DownloadIcon from 'react-icons/lib/fa/download'

// Custom
import { Row, Column } from 'uikit/Flex'
import ButtonGroup from 'uikit/ButtonGroup'
import Button from 'uikit/Button'
import theme from 'theme'
import SortTableButton from 'components/SortTableButton'
import ArrangeColumnsButton from 'components/ArrangeColumnsButton'

/*----------------------------------------------------------------------------*/

const styles = {
  tableActionButtons: {
    height: '3.5rem',
    width: '3.5rem',
    padding: '0.6rem',
    backgroundColor: 'white',
    color: theme.greyScale1,
    border: `1px solid ${theme.greyScale4}`,
    ':hover': {
      backgroundColor: theme.greyScale6,
    },
  },
}

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
      <ButtonGroup>
        <SortTableButton style={styles.tableActionButtons} />
        <ArrangeColumnsButton style={styles.tableActionButtons} />
        <Button style={styles.tableActionButtons} leftIcon={<DownloadIcon />} />
      </ButtonGroup>
    </Row>
  </Row>
)

SearchResultsHeader.propTypes = {
  count: PropTypes.number,
  type: PropTypes.string,
  total: PropTypes.number,
  location: PropTypes.object,
}

/*----------------------------------------------------------------------------*/

export default withRouter(SearchResultsHeader)
