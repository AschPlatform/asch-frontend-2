<template>
  <!-- if you want automatic padding use "layout-padding" class -->
    <q-tabs inverted align="justify"  class="tab-container">
      <q-route-tab default  name="delegates" to="delegates" exact slot="title" icon="people outline" :label="$t('DELEGATE_LIST')" />
      <q-route-tab name="voteRecords" to="voteRecords" slot="title" exact icon="people" :label="$t('VOTE_RECORD')" />
      <q-route-tab name="supporters" slot="title" to="supporters" icon="face" :label="$t('MY_VOTERS')" />
      <router-view :userObj="user" />
    </q-tabs>
</template>

<script>
import { QTabs, QRouteTab } from 'quasar'
export default {
  props: ['userObj'],
  data() {
    return {}
  },
  components: {
    QTabs,
    QRouteTab
  },
  mounted() {},
  computed: {
    user() {
      return this.userObj
    }
  },
  watch: {}
}
</script>

<style lang="stylus">

</style>
