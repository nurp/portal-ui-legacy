// Vendor
import React, { PropTypes } from 'react'
import { Sortable } from 'react-sortable'

/*----------------------------------------------------------------------------*/

const SortableItem = props => <div {...props}>{props.children}</div>
SortableItem.propTypes = { children: PropTypes.node }

/*----------------------------------------------------------------------------*/

export default Sortable(SortableItem)
