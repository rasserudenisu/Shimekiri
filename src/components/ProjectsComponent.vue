<template>
  <q-layout ref="layout">
      <q-list inset-separator class="no-border">
        <q-item class="group">
          <q-item-side icon="inbox" />
          <q-item-main :label="project.title" :sublabel="project.description ? project.description : 'No description found.'">
            <span v-if="project.tags">
            <q-chip tag small class="" color="primary" v-for="(tag, index) in project.tags" :key="index">{{tag}}</q-chip>
          </span>
        </q-item-main>
        <!-- <div slot="right" class="cursor-pointer relative-position inline-block"> </div> -->
    </q-item>
    <q-list-header>Tasks</q-list-header>

      <div v-if="getTasks.length > 0">
        <transition-group name="todo">
          <TodoComponent class="todo" v-for="(task, index) in getTasks" :key="task.uid" :task="task"/>
        </transition-group>
      </div>
      <div v-else>
        <q-item>
          <q-item-side icon="info"/>
          <q-item-main>
            <q-item-tile label>No Tasks Found</q-item-tile>
          </q-item-main>
        </q-item>
      </div>
  </q-list>
</q-layout>
</template>

<script>
import {
  QBtn,
  QChip,
  QCollapsible,
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
  QSideLink,
  QToggle,
  QToolbar,
  QToolbarTitle,
  QTooltip,
  Toast
} from 'quasar'
import TodoComponent from './comps/TaskComponent.vue'
// import TodoComponent from './comps/TodoCollComponent.vue'
import { mapGetters, mapMutations } from 'vuex'
import * as db from '../database/rx_db.js'
export default {
  name: 'index',
  components: {
    QBtn,
    QChip,
    QCollapsible,
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
    QSideLink,
    QToggle,
    QToolbar,
    QToolbarTitle,
    QTooltip,
    Toast,
    TodoComponent
  },
  beforeDestroy () {
    this.subs.forEach(sub => sub.unsubscribe())
  },
  computed: {
    getIcon () {
      return 'fa-check'
    },
    getColor () {
      if (this.isPastDue()) {
        return 'red-14'
      }
      return this.complete ? this.plan.color : 'grey-11'
    },
    getTasks () {
      var max = this.tasks.length
      if (this.displayCompleted) {
        this.setMinMax({min: max, max: max})
        return this.tasks
      }
      var min = this.tasks.filter(x => x.complete === false).length
      this.setMinMax({min: min, max: max})
      return this.tasks.filter(x => x.complete === false)
    },
    ...mapGetters(['displayCompleted', 'selectedProject'])
  },
  mounted: async function () {
    this.openProject()
  },
  watch: {
    selectedProject: function () {
      this.openProject()
    }
  },
  methods: {
    ...mapMutations(['setMinMax']),
    isVisible (planComplete) {
      if (this.displayCompleted) {
        return true
      }
      return !planComplete
    },
    unsubscribeAll () {
      this.subs.forEach(sub => sub.unsubscribe())
      this.subs = []
      this.tasks = []
    },
    openProject: async function () {
      var database = await db.db()

      database.projects
        .findOne()
        .where('title')
        .eq(this.selectedProject)
        .exec()
        .then(project => {
          this.project = project
        })

      var minMax = {
        min: 0,
        max: 0
      }

      database.tasks
        .find()
        .where('project')
        .eq(this.selectedProject)
        .exec()
        .then((docs) => {
          minMax.max = docs.length
        })

      this.subs.push(
        database.tasks
          .find()
          .where('project')
          .eq(this.selectedProject)
          .sort('deadline')
          .$
          .filter(x =>
            x != null
          )
          .subscribe(tasks => {
            this.tasks = tasks
            minMax.min = this.tasks.length
          })
      )

      this.setMinMax(minMax)
    },
    isPastDue () {
      if (new Date() > this.project.deadline) {
        return true
      }
      return false
    },
    advancedTask () {
      this.$router.push('/create/task/' + this.projectTitle)
    }
  },
  data: () => {
    return {
      tasks: [],
      subs: [],
      project: ''
    }
  }
}
</script>

<style lang="styl" scoped>
.todo {
  backface-visibility: hidden;
  z-index: 1;
}

.todo-move {
  transition: all 200ms ease-in-out 50ms;
}

.todo-enter-active {
  transition: all 200ms ease-in-out 100ms;
}

.todo-leave-active {
  transition: all 200ms ease-out 100ms;
  z-index: 0;
}

.todo-enter,
.todo-leave-to {
  opacity: 0;
}

.q-chip {
  margin 5px 5px 0 0
}
</style>
