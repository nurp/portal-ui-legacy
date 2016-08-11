const mergeFilters = ({ filterContent, value, field }) => ({
  op: 'and',
  content: [
    ...filterContent,
    {
      op: 'in',
      content: { field, value },
    },
  ],
})

const setFilter = ({ value, field }) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: { field, value },
    },
  ],
})

const setFilters = filterContent => filterContent.length && ({
  op: 'and',
  content: filterContent,
})

const inCurrentFilters = ({ currentFilters, key, dotField }) => currentFilters.some(f =>
  f.content.field === dotField && f.content.value.includes(key)
)

/*----------------------------------------------------------------------------*/

export {
  mergeFilters,
  setFilters,
  setFilter,
  inCurrentFilters,
}
