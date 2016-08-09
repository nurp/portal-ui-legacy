// Vendor
import React, { PropTypes } from 'react'

// Custom
import Card from 'uikit/Card'
import { Row, Column } from 'uikit/Flex'

const CountCard = ({ title, count, icon }) => (
  <Card style={{ padding: '1rem', width: '15rem' }}>
    <Row>
      <Column>
        <Row style={{ fontSize: '1rem' }}>{title}</Row>
        <Row style={{ fontSize: '2rem' }}>{count}</Row>
      </Column>
      <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>
        {icon}
      </Row>
    </Row>
  </Card>
)

CountCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  icon: PropTypes.node,
}

/*----------------------------------------------------------------------------*/

export default CountCard
