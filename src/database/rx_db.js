import * as rx from './rxdb.js'
import { uid } from 'quasar'

let db = async _ => {
  return rx.get()
}

let demoInbox = async _ => {
  const database = await rx.get()
  database.projects.find().where('title').eq('Inbox').exec().then((documents) => {
    if (documents.length === 0) {
      var one = {
        title: 'Feed Scooter',
        deadline: new Date(2017, 9, 9, 9, 30, 0).toISOString(),
        project: 'Inbox',
        description: 'What a fatty cat he is.',
        complete: false,
        color: 'purple',
        uid: uid(),
        tags: [
          'Fancy Feast',
          'No Diet'
        ]
      }
      var two = {
        title: 'Scooter\'s 10th Birthday Party',
        start: new Date(2018, 8, 8, 8, 30, 0).toISOString(),
        deadline: new Date(2018, 8, 8, 22, 15, 0).toISOString(),
        project: 'Inbox',
        description: 'Gotta cuddle with my buddy.',
        complete: false,
        color: 'teal',
        uid: uid(),
        tags: [
          'Big ONE O',
          'Decade'
        ]
      }
      var project = {
        title: 'Inbox',
        description: '',
        tags: [],
        // deadline: '',
        tasks: [
          one.uid,
          two.uid
        ]
      }

      database.projects.insert(project)
      database.tasks.insert(one)
      database.tasks.insert(two)
    }
    else {

    }
  })
}

export {
  demoInbox,
  db
}
