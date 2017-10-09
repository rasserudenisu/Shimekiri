<template>

  <q-layout ref="sidebarLayout" :left-breakpoint="leftBreak" :left-class="{'bg-grey-2': true}" >

    <q-toolbar slot="header" color="primary">
      <q-btn flat @click="$refs.sidebarLayout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
        {{selectedProject}}
        <span slot="subtitle" ref="projectSubtitle">{{this.$store.getters.minMaxDisplay}}</q-item-main></span>
      </q-toolbar-title>
      <q-btn flat>
        <q-icon name="more_vert" />
        <q-popover ref="popover">
          <q-list>
            <q-item link>
              <q-checkbox v-model="displayCompleted" label="Show Completed" @click="$refs.popover.close()"/>
            </q-item>
            <q-item link v-if="selectedProject !== 'Inbox'" @click="deleteProject()">
              <q-item-side icon="delete"/>
              <q-item-main>
                <q-item-tile label>Delete Project</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-popover>
      </q-btn>
    </q-toolbar>

    <q-list slot="left" no-border link inset-separator>
      <q-item sparse>
        <q-item-side icon="inbox" />
        <q-item-main @click="openProject('Inbox')">{{$t("inbox")}}</q-item-main>
      </q-item>
      <q-item-separator/>
      <q-list-header>Projects</q-list-header>
      <div v-if="projects.length > 1">
        <q-item sparse link v-for="(project, index) in projects" v-if="project.title !== 'Inbox'" :key="index">
          <q-item-side icon="inbox" />
          <q-item-main :label="project.title" :sublabel="project.description" @click="openProject(project.title)"/>
        </q-item>
      </div>
      <q-item v-else sparse>
        <q-item-side icon="add" color="purple"/>
        <q-item-main  @click="$router.push('/create/project')" >{{$t("createProject")}}</q-item-main>
      </q-item>
      <q-item-separator/>
      <q-side-link sparse item to="/page/settings">
        <q-item-side icon="settings"></q-item-side>
        <q-item-main>{{$t("settings")}}</q-item-main>
      </q-side-link>
    </q-list>

    <ProjectsComp/>

    <q-fixed-position corner="bottom-right" :offset="[18, 18]">
      <q-fab ref="fab" color="primary" active-icon="add" direction="up" class="fixed higherup" style="right: 18px; bottom: 18px">
        <q-fab-action color="primary" @click="$router.push('/create/project')" icon="inbox">
          <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Project</q-tooltip>
        </q-fab-action>
        <q-fab-action color="primary" @click="taskDialog()" icon="fa-tasks">
          <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Task</q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-fixed-position>
  </q-layout>
</template>

<script>
import {
  Dialog,
  QBtn,
  QCheckbox,
  QChip,
  QFab,
  QFabAction,
  QFixedPosition,
  QIcon,
  QInput,
  QItem,
  QItemMain,
  QItemSeparator,
  QItemSide,
  QItemTile,
  QLayout,
  QList,
  QListHeader,
  QModal,
  QModalLayout,
  QPopover,
  QSideLink,
  QToolbar,
  QToolbarTitle,
  QTooltip,
  uid,
  Toast
} from 'quasar'
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import * as db from '../database/rx_db.js'
import Chrono from 'chrono-node'
import ProjectsComp from '@/ProjectsComponent'
export default {
  name: 'index',
  components: {
    ProjectsComp,
    QBtn,
    QCheckbox,
    QChip,
    QFab,
    QFabAction,
    QFixedPosition,
    QIcon,
    QInput,
    QItem,
    QItemMain,
    QItemSeparator,
    QItemSide,
    QItemTile,
    QLayout,
    QList,
    QListHeader,
    QModal,
    QModalLayout,
    QPopover,
    QSideLink,
    QToolbar,
    QToolbarTitle,
    QTooltip
  },
  mounted: async function () {
    this.loadProjects()
    this.countLateTasks()
  },
  beforeDestroy () {
    this.subs.forEach(project => project.unsubscribe())
  },
  computed: {
    displayCompleted: {
      get () {
        return this.$store.state.showCompleted
      },
      set (value) {
        this.$store.commit('flipCompletion', value)
      }
    },
    ...mapGetters(['selectedProject'])
  },
  methods: {
    ...mapMutations([
      'flipCompletion',
      'setSelectedProject'
    ]),
    countLateTasks: async function () {
      if (this.$q.platform.is.cordova) {
        var database = await db.db()
        var count = 0
        database.tasks.find().where('deadline').lt(new Date()).exec().then((docs) => {
          count = docs.length
          console.log('late count:', count)
          this.$cordova.plugins.notification.badge.set(count)
        })
      }
    },
    deleteProject () {
      var self = this
      Dialog.create({
        title: 'Delete Project?',
        buttons: [
          {
            label: 'Cancel',
            handler () {

            }
          },
          {
            label: 'Delete',
            icon: 'fa-trash',
            color: 'red',
            handler () {
              self.finishDelete()
            }
          }
        ]
      })
    },
    finishDelete: async function () {
      var database = await db.db()
      database.projects.findOne({title: self.selectedProject}).exec().then((doc) => {
        doc.remove()
        Toast.create({
          html: 'Project deleted.',
          icon: 'fa-trash',
          timeout: 1000
        })
        this.setSelectedProject('Inbox')
      })
    },
    loadProjects: async function () {
      var database = await db.db()
      this.subs.push(
        database.projects
          .find()
          .$
          .filter(x => {
            return x != null
          })
          .subscribe(projects => {
            this.projects = projects
          })
      )
    },
    openProject (title) {
      this.$nextTick(() => {
        if (this.$q.platform.is.mobile) {
          this.$refs.sidebarLayout.hideLeft()
        }
        this.$refs.fab.close()
        this.setSelectedProject(title)
      })
    },
    taskDialog: async function () {
      var database = await db.db()
      var self = this
      Dialog.create({
        title: 'New Task',
        position: 'top',
        form: {
          title: {
            type: 'text',
            label: 'Title',
            model: ''
          }
        },
        buttons: [
          {
            label: 'Advanced',
            handler (task) {
              self.$router.push('/create/task/')
            }
          },
          {
            label: 'Save',
            handler (task) {
              var cResult = Chrono.parse(task.title)
              if (cResult[0] !== undefined) {
                if (cResult[0].start.date()) {
                  task.title = _.replace(task.title, cResult[0].text, '').trim()
                  if (cResult[0].end !== undefined) {
                    task.start = cResult[0].start.date().toISOString()
                    task.deadline = cResult[0].end.date().toISOString()
                  }
                  else {
                    task.deadline = cResult[0].start.date().toISOString()
                  }
                }
              }
              else {
                var d = new Date()
                d.setDate(d.getDate() + 1)
                task.deadline = d.toISOString()
              }

              task.description = ''
              task.complete = false
              task.tags = []
              task.color = 'grey'
              task.uid = uid()
              task.project = self.selectedProject

              database.tasks.insert(task)
              Toast.create({
                html: 'Task created.',
                icon: 'info',
                timeout: 1000
              })
            }
          }
        ]
      })
    }
  },
  data: () => {
    return {
      subs: [],
      projects: [],
      leftBreak: 900,
      taskModalText: ''
    }
  }
}
</script>

<style lang="stylus">
.higherup {
  z-index 1000
}
</style>
