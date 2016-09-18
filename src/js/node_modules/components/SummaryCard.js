// Vendor
import React, { PropTypes } from 'react'

// Custom
import PieChart from 'components/PieChart'
import { Row, Column } from 'uikit/Flex'
import Card from 'uikit/Card'
import theme from 'theme'
import { center } from 'theme/mixins'

/*----------------------------------------------------------------------------*/

const styles = {
  header: {
    padding: '1rem',
    borderBottom: `1px solid ${theme.greyScale4}`,
    color: theme.primary,
  },
  footer: {
    padding: '1rem',
    borderTop: `1px solid ${theme.greyScale4}`,
    ...center,
  },
}

const SummaryCard = ({ data, title, style, footer, ...props }) => (
  <Card style={style} {...props}>
    <Column>
      <div style={styles.header}>{title}</div>
      <PieChart data={data} />
      {footer && <Row style={styles.footer}>{footer}</Row>}
    </Column>
  </Card>
)

SummaryCard.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
  data: PropTypes.array,
  footer: PropTypes.node,
}

/*----------------------------------------------------------------------------*/

export default SummaryCard
