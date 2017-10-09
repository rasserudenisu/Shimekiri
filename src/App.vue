<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import * as db from './database/rx_db.js'
export default {
  mounted: async function () {
    this.$i18n.locale = this.$localStorage.get('languageSelection', 'en')
    db.demoInbox()
  }
}
</script>

<style>
</style>
