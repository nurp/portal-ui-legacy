// Vendor
import React, { PropTypes } from 'react'
import { shouldUpdate, lifecycle, compose } from 'recompose'
import Relay from 'react-relay'
import { connect } from 'react-redux'

// Custom
import { Column } from 'uikit/Flex'
import CasesAggregations from 'containers/CasesAggregations'
import FilesAggregations from 'containers/FilesAggregations'
import FileTable from 'containers/FileTable'

/*----------------------------------------------------------------------------*/

const styles = {
  container: {
    padding: '2rem 2.5rem 13rem',
  },
}

const CartPage = ({ viewer, relay, files }) => {

  const Results = viewer.files.hits ? <FileTable hits={viewer.files.hits} /> : null

  return (
    <Column style={styles.container}>
      {!!files.length && Results}
      {!files.length && <h1>Empty Cart</h1>}
    </Column>
  )
}

CartPage.propTypes = {
  viewer: PropTypes.object,
  relay: PropTypes.object,
}

const enhance = compose(
  shouldUpdate((props, nextProps) => {
    if (props.files.length !== nextProps.files.length) {
      props.relay.setVariables({
        getFiles: true,
        filters: {
          content: [{
            content: {
              field: 'files.file_id',
              value: nextProps.files.map(x => x.file_id),
            },
            op: 'in',
          }],
          op: 'and',
        },
      })
    }

    return true
  })
)

export { CartPage }

export default Relay.createContainer(
  connect(state => state.cart)(enhance(CartPage)), {
    initialVariables: {
      first: 20,
      offset: 0,
      filters: {},
      getFiles: false,
      sort: '',
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Root {
          cases {
            aggregations(filters: $filters) {
              ${CasesAggregations.getFragment('aggregations')}
            }
          }
          files {
            aggregations(filters: $filters) {
              ${FilesAggregations.getFragment('aggregations')}
            }
            hits(first: $first, offset: $offset, filters: $filters, sort: $sort)
            @include(if: $getFiles) {
              ${FileTable.getFragment('hits')}
            }
          }
        }
      `,
    },
  }
)
