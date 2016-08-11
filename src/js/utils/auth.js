import _ from 'lodash'

/*----------------------------------------------------------------------------*/

const isUserProject = ({ user, file }) => {
  if (!user) {
    return false
  }

  let projectIds

  // Support multiple use cases
  if (file.projects) {
    projectIds = _.unique(file.projects.map(p => p.project_id || p))
  } else {
    projectIds = _.unique(file.cases.map(p => p.project.project_id))
  }

  return !!_.intersection(projectIds, user.projects.gdc_ids).length
}

const userCanDownloadFiles = ({ user, files }) => (
  files.every(file => {
    if (file.access === 'open') {
      return true
    }

    if (file.access !== 'open' && !user) {
      return false
    }

    if (isUserProject({ user, file })) {
      return true
    }

    return false
  })
)

const userCanDownloadFile = ({ user, file }) => userCanDownloadFiles({ user, files: [file] })

/*----------------------------------------------------------------------------*/

export { isUserProject, userCanDownloadFiles, userCanDownloadFile }
