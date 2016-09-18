// Vendor
import React, { PropTypes } from 'react'
import Radium from 'radium'
import { withRouter } from 'react-router'
import LeftArrow from 'react-icons/lib/fa/long-arrow-left'
import ShoppingCartIcon from 'react-icons/lib/fa/shopping-cart'

// Custom
import { Row, Column } from 'uikit/Flex'
import Button from 'uikit/Button'
import Info from 'uikit/Alerts/Info'
import theme from 'theme'
import CurrentFilters from 'components/CurrentFilters'
import DownloadManifestButton from 'containers/DownloadManifestButton'

/*----------------------------------------------------------------------------*/

const styles = {
  container: {
    padding: '2rem 2.5rem 13rem',
  },
  facetsPanel: {
    width: theme.facetsPanelWidth,
  },
  facet: {
    backgroundColor: 'white',
  },
  content: {
    marginLeft: '18px',
    width: `calc(100% - ${theme.facetsPanelWidth})`,
  },
}

const SearchPage = ({
  location,
  Results,
  Facets,
  hits,
}) => (
  <Row style={styles.container}>
    <Column style={styles.facetsPanel}>
      {Facets}
    </Column>

    <Column style={styles.content}>
      {!location.query.filters &&
        <Info>
          <LeftArrow />
          <span style={{ marginLeft: '0.6rem' }}>
            Start searching by selecting a facet
          </span>
        </Info>
      }

      {location.query.filters &&
        <Info>
          <CurrentFilters />
        </Info>
      }

      <Info>
        <Button leftIcon={<ShoppingCartIcon />}>Add all files to the cart</Button>
        <DownloadManifestButton hits={hits} />
      </Info>

      {Results}
    </Column>
  </Row>
)

SearchPage.propTypes = {
  Results: PropTypes.node,
  Facets: PropTypes.node,
  location: PropTypes.object,
}

/*----------------------------------------------------------------------------*/

export default Radium(withRouter(SearchPage))
