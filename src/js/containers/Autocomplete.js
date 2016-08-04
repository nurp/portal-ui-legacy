// Vendor
import React, { PropTypes } from 'react'
import Relay from 'react-relay'

import FileTBody from './FileTBody'
import Pagination from './Pagination'

/*----------------------------------------------------------------------------*/

const Autocomplete = props => {
  console.log('testing', props)
  return <div>Hey</div>
}

/*----------------------------------------------------------------------------*/

export { Autocomplete }

export default Relay.createContainer(Autocomplete, {
  initialVariables: {
    first: 10,
    offset: 0,
    filters: null,
    sort: '',
  },
  fragments: {
    hits: () => Relay.QL`
      fragment on CaseConnection {
        edges {
          node {
            id
            case_id
          }
        }
      }
    `,
  },
})
