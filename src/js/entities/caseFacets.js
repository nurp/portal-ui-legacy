export const caseFacets = [
  {
    name: 'submitter_id',
    title: 'Case Submitter ID Prefix',
    collapsed: false,
    facetType: 'prefix',
    placeholder: 'e.g. TCGA-DD*',
  },
  {
    name: 'case_id',
    title: 'Case',
    collapsed: false,
    facetType: 'free-text',
    placeholder: 'UUID, Submitter ID',
  },
  {
    name: 'project__primary_site',
    title: 'Primary Site',
    collapsed: false,
    facetType: 'terms',
  },
  {
    name: 'project__program.name',
    title: 'Cancer Program',
    collapsed: false,
    facetType: 'terms',
  },
  {
    name: 'project__project_id',
    title: 'Project',
    collapsed: false,
    facetType: 'terms',
  },
  {
    name: 'project__disease_type',
    title: 'Disease Type',
    collapsed: false,
    facetType: 'terms',
  },
  {
    name: 'demographic__gender',
    title: 'Gender',
    collapsed: false,
    facetType: 'terms',
  },
  {
    name: 'diagnoses__age_at_diagnosis',
    title: 'Age at diagnosis',
    collapsed: false,
    facetType: 'range',
    convertDays: true,
  },
  {
    name: 'diagnoses__vital_status',
    title: 'Vital Status',
    collapsed: false,
    facetType: 'terms',
  },
  {
    name: 'diagnoses__days_to_death',
    title: 'Days to Death',
    collapsed: false,
    facetType: 'range',
    hasGraph: true,
  },
  {
    name: 'demographic__race',
    title: 'Race',
    collapsed: false,
    facetType: 'terms',
  },
  {
    name: 'demographic__ethnicity',
    title: 'Ethnicity',
    collapsed: false,
    facetType: 'terms',
  },
]
