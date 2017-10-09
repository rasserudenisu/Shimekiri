const ProjectSchema = {
  'version': 0,
  'properties': {
    'deadline': {
      'type': 'string'
    },
    'start': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'tags': {
      'items': {
        'type': 'string'
      },
      'type': 'array'
    },
    'tasks': {
      'items': {
        'type': 'string'
      },
      'type': 'array'
    },
    'title': {
      'type': 'string',
      index: true
    }
  },
  'type': 'object'
}

export default ProjectSchema
