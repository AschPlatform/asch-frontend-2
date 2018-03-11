<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-fab icon="format list bulleted" direction="up" color="primary">
      <q-fab-action @click="openTrans" color="blue" class="white" icon="compare arrows" />
      <q-fab-action @click="router.push({name:'account'})" color="blue" class="white" icon="attach money" />
      <q-fab-action @click="router.push({name:'home'})" color="blue" class="white" icon="home" />
    </q-fab>
  </q-page-sticky>
</template>

<script>
import { QPageSticky } from 'quasar'

export default {
  name: 'FloatMenu',
  props: ['router'],
  components: {
    QPageSticky
  },
  data() {
    return {}
  },
  methods: {
    openTrans() {
      this.$root.$emit('openTransactionDialog')
    }
  }
}
</script>
