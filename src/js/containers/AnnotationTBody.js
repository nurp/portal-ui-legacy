// Vendor
import Relay from 'react-relay'
import { tbody, h } from 'react-hyperscript-helpers'

// Custom
import theme from 'theme'
import AnnotationTr from 'containers/AnnotationTr'

/*----------------------------------------------------------------------------*/

export const AnnotationTBody = props => {
  console.log(2, props)
  return (
    tbody(
      props.edges.map((e, i) => (
        h(AnnotationTr, {
          ...e,
          style: i % 2 === 0 ? { backgroundColor: theme.greyScale6 } : {},
          key: e.node.id,
        })
      ))
    )
  )
}

export default Relay.createContainer(AnnotationTBody, {
  fragments: {
    edges: () => Relay.QL`
      fragment on AnnotationEdge @relay(plural: true){
        node {
          id
          ${AnnotationTr.getFragment('node')}
        }
      }
    `,
  },
})
