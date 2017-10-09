import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  routes: [
    { path: '/', component: load('HomeComponent') },
    { path: '/create/project', component: load('comps/CreateProjectComp') },
    { path: '/create/task', component: load('comps/CreateTaskComp') },
    { path: '/page/settings', component: load('page/Settings') },
    { path: '*', component: load('page/Error404') }
  ]
})
