// Vendor
import React, { PropTypes } from 'react'

// Custom
import PieChart from 'components/PieChart'
import { Column } from 'uikit/Flex'
import Card from 'uikit/Card'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  header: {
    padding: '1rem',
    borderBottom: `1px solid ${theme.greyScale4}`,
    color: theme.primary,
  },
}

const SummaryCard = ({ data, title, style, ...props }) => (
  <Card style={style} {...props}>
    <Column>
      <div style={styles.header}>{title}</div>
      <PieChart data={data} />
    </Column>
  </Card>
)

SummaryCard.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
}

/*----------------------------------------------------------------------------*/

export default SummaryCard
