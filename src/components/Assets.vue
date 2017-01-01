<template>
  <!-- if you want automatic padding use "layout-padding" class -->
    <q-tabs inverted align="justify">
      <q-tab default name="account" slot="title" icon="web asset" :label="$t('ASSET_PROFILE')" />
      <q-tab name="publisher" slot="title" icon="business" :label="$t('REGISTERED_PUBLISHER')" />
      <q-tab name="assets" slot="title" icon="assessment" :label="$t('REGISTERED_ASSETS')" />
      <q-tab name="myAssets" slot="title" icon="publish" :label="$t('MY_ASSETS')" />
      <q-tab name="records" slot="title" icon="note" :label="$t('OPERATION_RECORD')" />
  
      <q-tab-pane class="qt-panel" name="account"><assets-account :userObj="user" /></q-tab-pane>
      <q-tab-pane name="publisher"> <assets-publisher :userObj="user" /> </q-tab-pane>
      <q-tab-pane name="assets"> <assets-register :userObj="user" /></q-tab-pane>
      <q-tab-pane name="myAssets"> <assets-published :userObj="user" /></q-tab-pane>
      <q-tab-pane name="records"> <assets-records :userObj="user" /></q-tab-pane>
    </q-tabs>
</template>

<script>
import { QTabs, QTab, QTabPane } from 'quasar'
import AssetsAccount from './bricks/AssetsAccount'
import AssetsPublisher from './bricks/AssetsPublisher'
import AssetsRegister from './bricks/AssetsRegister'
import AssetsPublished from './bricks/AssetsPublished'
import AssetsRecords from './bricks/AssetsRecords'
export default {
  props: ['userObj'],
  components: {
    AssetsAccount,
    AssetsPublisher,
    AssetsRegister,
    AssetsPublished,
    AssetsRecords,
    QTabs,
    QTab,
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

<style lang="stylus">
</style>
