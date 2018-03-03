<template>
  <!-- if you want automatic padding use "layout-padding" class -->
    <q-tabs inverted align="justify">
      <q-route-tab default  name="account" to="account" exact slot="title" icon="web asset" :label="$t('ASSET_PROFILE')" />
      <q-route-tab name="publisher" to="publisher" slot="title" exact icon="business" :label="$t('REGISTERED_PUBLISHER')" />
      <q-route-tab name="assets" slot="title" to="addAssets" icon="assessment" :label="$t('REGISTERED_ASSETS')" />
      <q-route-tab name="myAssets" slot="title" to="list"  icon="publish" :label="$t('MY_ASSETS')" />
      <q-route-tab name="records" slot="title" to="records"  icon="note" :label="$t('OPERATION_RECORD')" />
      <router-view :userObj="user" />
    </q-tabs>
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
    async refresh(done) {
      this.resetTable()
      done()
    }
  },
  computed: {
    user() {
      return this.userObj
    }
  },
  mounted() {},
  watch: {
    userObj(val) {}
  },
  created() {
    // register event
  },
  beforeDestroy() {}
}
</script>

<style>

</style>
