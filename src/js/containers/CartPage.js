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

const CartPage = ({ viewer, files }) => {
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
  files: PropTypes.array,
}

const getCartFilterVariables = files => ({
  getFiles: true,
  filters: {
    content: [{
      content: {
        field: 'files.file_id',
        value: files.map(x => x.file_id),
      },
      op: 'in',
    }],
    op: 'and',
  },
})

const enhance = compose(
  lifecycle({
    componentDidMount() {
      if (this.props.files.length) {
        this.props.relay.setVariables(getCartFilterVariables(this.props.files))
      }
    },
  }),
  shouldUpdate((props, nextProps) => {
    if (props.files.length !== nextProps.files.length && nextProps.files.length) {
      props.relay.setVariables(getCartFilterVariables(nextProps.files))
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
