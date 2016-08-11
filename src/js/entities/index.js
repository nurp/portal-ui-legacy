import annotationFacets from './annotationFacets'
import annotationTable from './annotationTable'
import fileFacets from './fileFacets'
import fileTable from './fileTable'

/*----------------------------------------------------------------------------*/

export default {
  annotations: {
    facets: annotationFacets,
    table: annotationTable,
  },
  files: {
    facets: fileFacets,
    table: fileTable,
  },
}
