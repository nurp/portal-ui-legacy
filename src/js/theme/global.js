import theme from 'theme'

const background = {
  width: '100%',
  height: '100%',
  margin: 0,
  backgroundColor: theme.greyScale5,
}

const global = {
  html: {
    ...background,
    fontSize: '10px',
  },
  '#root': background,
  '#app': background,
  body: {
    ...background,
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '14px',
  },
  '*': {
    boxSizing: 'border-box !important',
    outline: 'none !important',
  },
  a: {
    color: theme.primary,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  h2: {
    textTransform: 'capitalize',
    fontWeight: 300,
    margin: '0.5rem 0',
  },
}

export default global
