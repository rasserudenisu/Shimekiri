<template>
  <q-card :color="getBackgroundColor">

    <q-card-title>
      {{task.title}}


      <span slot="subtitle" >
        <transition  name="fade" mode="out-in">
          <span v-if="!isComplete" key="subDue">
            <span>{{getDueDate()}}</span>
          </span>
          <span v-if="isComplete" key="subComplete">
            <span>{{$t('complete')}}</span>
          </span>
        </transition>
      </span>

      <span slot="right" >

        <transition mode="out-in" enter-active-class="animated rotateIn" leave-active-class="animated rotateOut">
          <q-btn v-if="isComplete" key="btnComp" :color="getColor" :outline="isComplete" round small @click="completeTask()" style="margin-right: 1em">
            <q-icon :name="getIcon" />
          </q-btn>
          <q-btn v-else key="btnIncomp" :color="getColor" :flat="!isComplete" round small @click="completeTask()" style="margin-right: 1em">
            <q-icon :name="getIcon" />
          </q-btn>
        </transition>
        <q-icon name="more_vert">
          <q-popover ref="popover">
            <q-list link class="no-border">
              <q-item @click="$refs.popover.close(), deleteTask()">
                <q-item-main label="Remove Task" />
              </q-item>
            </q-list>
          </q-popover>
        </q-icon>
      </span>
    </q-card-title>
    <q-card-main v-if="task.description || task.tags.length > 0">
      <p v-if="task.description">{{task.description}}</p>
      <q-chip v-if="task.tags" icon="label_outline" :color="tagColor" v-for="(tag, index) in task.tags" :key="index">{{tag}}</q-chip>
    </q-card-main>
  </q-card>
</template>

<script>
import {
  Dialog,
  QCard,
  QCardTitle,
  QCardMedia,
  QCardActions,
  QCardSeparator,
  QCardMain,
  QBtn,
  QChip,
  QIcon,
  QPopover,
  QList,
  QItem,
  QItemMain
} from 'quasar'
import moment from 'moment'
export default {
  name: 'shimekiri-task',
  components: {
    QBtn,
    QChip,
    QIcon,
    QCard,
    QCardTitle,
    QCardMedia,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QList,
    QPopover,
    QItem,
    QItemMain
  },
  props: {
    task: Object
  },
  computed: {
    getIcon () {
      return this.task.complete ? 'fa-check' : 'fa-clock-o'
    },
    getColor () {
      if (this.isPastDue()) {
        return 'white'
      }
      if (this.task.color === 'grey') {
        return this.task.color
      }
      return 'white'
    },
    getBackgroundColor () {
      if (this.isPastDue()) {
        return 'red-14'
      }
      if (this.task.color === 'grey') {
        return null
      }
      return this.task.color
    },
    tagColor () {
      if (this.isPastDue()) {
        return 'red-14'
      }
      return this.task.color
    },
    isComplete () {
      return this.task.complete
    }
  },
  methods: {
    getDueDate () {
      moment.locale(this.$localStorage.get('dateFormat', 'en-gb'))

      if (!this.task.start && !this.task.deadline) {
        return 'no due date'
      }

      if (this.task.start) {
        if (!JSON.parse(this.$localStorage.get('fuzzy', true))) {
          return 'from ' + moment(this.task.start).format(this.$localStorage.get('detailSelect', 'LL')) + ', thru ' + (moment(this.task.deadline).subtract(this.task.start)).format(this.$localStorage.get('detailSelect', 'LL'))
        }
        var dur = moment(this.task.deadline).diff(this.task.start, 'hours', true)
        return 'starting ' + moment(this.task.start).fromNow() + ', ending after ' + moment.duration(dur, 'hours').humanize()
      }

      if (!JSON.parse(this.$localStorage.get('fuzzy', true))) {
        return moment(this.task.deadline).format(this.$localStorage.get('detailSelect', 'LL'))
      }
      return moment(this.task.deadline).fromNow()
    },
    isPastDue () {
      if (!this.task.complete && new Date() > moment(this.task.deadline)) {
        return true
      }
      return false
    },
    deleteTask () {
      var self = this
      Dialog.create({
        title: 'Confirm Deletion',
        buttons: [
          {
            label: 'Cancel',
            handler () {

            }
          },
          {
            label: 'Confirm',
            handler () {
              self.task.remove()
            }
          }
        ]
      })
    },
    completeTask () {
      this.task.set('complete', !this.task.get('complete'))
      this.task.save()
    }
  }
}
</script>

<style scoped>
.q-chip {
  margin-right: 5px;
}
</style>
