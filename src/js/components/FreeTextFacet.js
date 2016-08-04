// Vendor
import React, { PropTypes } from 'react'
import { compose, withState, mapProps, pure } from 'recompose'
import { Link, withRouter } from 'react-router'
import AngleIcon from 'react-icons/lib/fa/angle-down'
import SearchIcon from 'react-icons/lib/fa/search'

// Custom
import { mergeFilters, setFilters, setFilter, inCurrentFilters } from 'utils/filters'
import { Row, Column } from 'uikit/Flex'
import A from 'uikit/A'
import { Input } from 'uikit/Form'
import theme from 'theme'

/*----------------------------------------------------------------------------*/

const styles = {
  container: {
    padding: '1rem 1.2rem',
  },
  header: {
    color: theme.primaryLight1,
    fontSize: '1.7rem',
    marginBottom: '0.5rem',
    cursor: 'pointer',
  },
  bucketRow: {
    padding: '0.3rem 0',
  },
  bucketLink: {
    color: '#3a3a3a',
    textDecoration: 'none',
  },
  toggleMore: {
    marginLeft: 'auto',
    color: theme.primaryLight1,
    fontSize: '1.2rem',
    cursor: 'pointer',
    ':hover': {
      color: 'blue',
      textDecoration: 'underline',
    },
  },
  searchIcon: {
    backgroundColor: theme.greyScale5,
    color: theme.greyScale2,
    padding: '0.8rem',
    width: '3.4rem',
    height: '3.4rem',
    borderRadius: '4px 0 0 4px',
    border: `1px solid ${theme.greyScale4}`,
    borderRight: 'none',
  },
}

let input

const FreeTextFacet = ({
  location,
  field,
  title,
  pathname,
  state,
  toggleCollapsed,
  placeholder,
  ...props,
}) => {
  // const { filters, offset, ...query } = location.query
  // const dotField = field.replace(/__/g, '.')
  // const currentFilters = location.query.filters ? JSON.parse(filters).content : []

  return (
    <Column style={styles.container}>
      <Row style={styles.header} onClick={() => toggleCollapsed()}>
        <AngleIcon style={{ transform: `rotate(${state.collapsed ? 270 : 0}deg)` }} />
        {title}
      </Row>
      {!state.collapsed &&
        <Row>
          <SearchIcon style={styles.searchIcon} />
          <Input
            getNode={node => { input = node }}
            onChange={() => props.setAutocomplete(input.value)}
            placeholder={placeholder}
          />
        </Row>
      }
    </Column>
  )
}

FreeTextFacet.propTypes = {
  title: PropTypes.string,
  buckets: PropTypes.array,
  pathname: PropTypes.string,
  filters: PropTypes.object,
  state: PropTypes.object, // TODO: make shape
  toggleCollapsed: PropTypes.func,
  location: PropTypes.object,
  field: PropTypes.string,
  placeholder: PropTypes.string,
}

const enhance = compose(
  withRouter,
  withState('state', 'setState', { collapsed: false }),
  mapProps(({ setState, ...rest }) => ({
    toggleCollapsed: () => setState(state => ({ collapsed: !state.collapsed })),
    ...rest,
  })),
  pure
)

/*----------------------------------------------------------------------------*/

export default enhance(FreeTextFacet)
