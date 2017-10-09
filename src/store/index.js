import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showCompleted: true,
    selectedProject: 'Inbox',
    minMax: {
      min: 0,
      max: 0
    }
  },
  mutations: {
    flipCompletion (state, value) {
      state.showCompleted = !state.showCompleted
    },
    setSelectedProject (state, value) {
      state.selectedProject = value
    },
    setMinMax (state, value) {
      state.minMax = value
    }
  },
  getters: {
    displayCompleted: state => state.showCompleted,
    selectedProject: state => state.selectedProject,
    minMaxDisplay: state => state.minMax.min + ' of ' + state.minMax.max
  }
})
