<template>
  <div>
    
  </div>    
</template>

<script>
import { QTabs, QRouteTab, QTabPane } from 'quasar'
export default {
  props: ['userObj'],
  components: {
    QTabs,
    QRouteTab,
    QTabPane
  },
  data() {
    return {}
  },
  methods: {
    routerConfig(name) {
      return {
        name: name,
        params: {
          user: this.user
        }
      }
    }
  },
  computed: {
    user() {
      return this.userObj
    }
  },
  mounted() {},
  watch: {},
  created() {
    // register event
  },
  beforeDestroy() {}
}
</script>

<style>

</style>
