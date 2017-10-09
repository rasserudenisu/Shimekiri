const TaskSchema = {
  'version': 0,
  'type': 'object',
  'properties': {
    'uid': {
      'type': 'string'
    },
    'project': {
      'type': 'string'
    },
    'color': {
      'type': 'string'
    },
    'complete': {
      'type': 'boolean'
    },
    'deadline': {
      'type': 'string',
      index: true
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
    'title': {
      'type': 'string',
      index: true
    }
  }
}

export default TaskSchema
