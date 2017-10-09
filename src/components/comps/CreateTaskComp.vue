<template>
  <q-layout ref="layout" view="hHh lpr lfr">

    <q-toolbar slot="header">
      <q-btn flat @click="$router.push('/')">
        <q-icon name="arrow_back" />
      </q-btn>
      <q-toolbar-title>
        {{$t("createTask")}}
      </q-toolbar-title>
      <q-btn flat @click="verifyData()">
        <q-icon name="save" />
      </q-btn>
    </q-toolbar>

    <q-list class="no-border">
      <q-list-header>Project</q-list-header>
      <q-item>
        <q-item-side icon="fa-inbox" />
        <q-item-main>
          <q-select filter class="no-margin" float-label="Target Project" v-model="projectTitle" :options="projects" />
        </q-item-main>
      </q-item>
      <q-list-header>Details</q-list-header>
      <q-item>
        <q-item-main>
          <q-field icon="title" class="no-margin" :error="$v.titleModel.$error" :error-label="titleError()">
            <q-input max-length="64" float-label="Task Title" v-model.trim="titleModel" @blur="$v.titleModel.$touch" />
          </q-field>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-field icon="description" class="no-margin">
            <q-input max-length="128" float-label="Description" v-model.trim="descriptionModel" />
          </q-field>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-field icon="timelapse" helper="When is this due?" >
            <q-datetime v-model="deadlineModel" class="no-margin" format="YYYY-MM-DD @ HH:mm" stack-label="Deadline" type="datetime" monday-first format24h/>
          </q-field>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-field icon="access_time" helper="Starting From? (Not necessary)" >
            <q-datetime v-model="startModel" class="no-margin" format="YYYY-MM-DD @ HH:mm" stack-label="Starting From" type="datetime" monday-first format24h/>
          </q-field>
        </q-item-main>
      </q-item>
      <q-item multiline>
        <q-item-main>
          <q-field icon="label" class="no-margin" label="Tags" :error="$v.tagModel.$error" error-label="Three tags maximum.">
            <q-chips-input max-length="3" v-model="tagModel" @blur="$v.tagModel.$touch" />
          </q-field>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-field icon="color_lens" class="no-margin" label="Color">
            <div class="row">
              <q-radio class="col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-model="colorModel" val="grey" color="grey" label="Default"/>
              <q-radio class="col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-model="colorModel" val="red" color="red" label="Red"/>
              <q-radio class="col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-model="colorModel" val="orange" color="orange" label="Orange"/>
              <!-- <q-radio class="col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-model="colorModel" val="yellow" color="yellow" label="Yellow"/> -->
              <q-radio class="col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-model="colorModel" val="green" color="green" label="Green"/>
              <q-radio class="col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-model="colorModel" val="blue" color="blue" label="Blue"/>
              <q-radio class="col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-model="colorModel" val="teal" color="teal" label="Teal"/>
              <q-radio class="col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-model="colorModel" val="purple" color="purple" label="Violet"/>
            </div>
          </q-field>
        </q-item-main>
      </q-item>
    </q-list>

  </q-layout>
</template>

<script>
import {
  QBtn,
  QChipsInput,
  QDatetime,
  QField,
  QIcon,
  QInput,
  QItem,
  QItemMain,
  QItemSeparator,
  QItemSide,
  QLayout,
  QList,
  QListHeader,
  QOptionGroup,
  QRadio,
  QSelect,
  QToolbar,
  QToolbarTitle,
  Toast,
  uid
} from 'quasar'
import { required, maxLength } from 'vuelidate/lib/validators'
import * as db from '../../database/rx_db.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    QSelect,
    QBtn,
    QIcon,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QInput,
    QDatetime,
    QChipsInput,
    QField,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemSeparator,
    QListHeader,
    QRadio,
    QOptionGroup
  },
  data () {
    return {
      projectTitle: '',
      titleModel: '',
      descriptionModel: '',
      tagModel: [],
      deadlineModel: this.tomorrow(),
      startModel: undefined,
      colorModel: 'grey',
      projects: [],
      canGoBack: window.history.length > 1
    }
  },
  validations: {
    titleModel: {
      required
    },
    tagModel: {
      maxLength: maxLength(3)
    }
  },
  computed: {
    ...mapGetters(['selectedProject'])
  },
  mounted: async function () {
    this.loadProjects()
    // this.projects = ['Inbox']
    this.projectTitle = this.selectedProject
  },
  methods: {
    ...mapMutations([
      'setSelectedProject'
    ]),
    titleError () {
      if (this.$v.titleModel.$error) {
        if (!this.$v.titleModel.required) {
          return 'Title is required.'
        }
      }
      return null
    },
    loadProjects: async function () {
      var database = await db.db()
      database.projects.find({}).exec().then((docs) => {
        this.projects = docs.map(x => {
          return {label: x.title, value: x.title}
        })
      })
    },
    tomorrow () {
      var date = new Date()
      return date.setDate(date.getDate() + 1)
    },
    verifyData () {
      if (this.tagModel.length > 3 || !this.$v.titleModel.required) {
        Toast.create({
          html: 'Please correct the errors listed above.',
          icon: 'error',
          timeout: 1000
        })
        return
      }

      var task = {
        project: this.selectedProject,
        title: this.titleModel,
        description: this.descriptionModel,
        tags: this.tagModel,
        deadline: new Date(this.deadlineModel).toISOString(),
        complete: false,
        color: this.colorModel,
        uid: uid()
      }
      if (this.startModel) {
        task.start = new Date(this.startModel).toISOString()
      }
      this.insertTaskData(task)
    },
    goBack () {
      this.$router.push('/')
    },
    insertTaskData: async function (task) {
      var database = await db.db()
      database.tasks.insert(task)
      this.$router.push('/')
      this.setSelectedProject(this.projectTitle)
    }
  }
}
</script>

<style lang="stylus">

</style>
