<template>
  <q-layout ref="layout" >

    <q-toolbar slot="header">
      <q-btn flat v-if="canGoBack" @click="goBack">
        <q-icon name="arrow_back" />
      </q-btn>


      <q-toolbar-title>
        {{$t("createProject")}}
      </q-toolbar-title>
      <q-btn flat @click="verifyData()">
        <q-icon name="save" />
      </q-btn>
    </q-toolbar>

    <q-list class="no-border">
      <q-list-header>Details</q-list-header>
      <q-item>
        <q-item-main>
          <q-field icon="title" :error="$v.titleModel.$error" :error-label="titleError()" >
            <q-input max-length=64 v-model.trim="titleModel" @blur="$v.titleModel.$touch" float-label="Project Title"/>
          </q-field>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-field icon="description">
            <q-input max-length=128 v-model.trim="descriptionModel"  float-label="Description"/>
          </q-field>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-field icon="label" :error="$v.tagModel.$error" error-label="Three tags maximum.">
            <q-chips-input max-length=3 v-model="tagModel" @blur="$v.tagModel.$touch"  float-label="Tags"/>
          </q-field>
        </q-item-main>
      </q-item>
      <q-list-header>Deadline</q-list-header>
      <q-item>
    <q-item-side icon="access_time" />
    <q-item-main>
            <q-datetime v-model="timeModel" class="no-margin" format="YYYY-MM-DD @ HH:mm" type="datetime" monday-first format24h/>
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
  QToolbar,
  QToolbarTitle,
  Toast
} from 'quasar'
import * as db from '../../database/rx_db.js'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapMutations } from 'vuex'
export default {
  components: {
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
    QToolbar,
    QToolbarTitle
  },
  data () {
    return {
      titleModel: '',
      descriptionModel: '',
      tagModel: [],
      timeModel: this.tomorrow(),
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

      var project = {
        title: this.titleModel,
        description: this.descriptionModel,
        tags: this.tagModel,
        deadline: new Date(this.timeModel).toISOString(),
        tasks: []
      }
      this.insertProjectData(project)
    },
    insertProjectData: async function (project) {
      var database = await db.db()
      database.projects.insert(project)
      Toast.create({
        html: 'Project created.',
        icon: 'info',
        timeout: 1000
      })
      this.$router.push('/')
      this.setSelectedProject(project.title)
    },
    goBack () {
      window.history.go(-1)
    }
  }
}
</script>

<style lang="stylus">

</style>
