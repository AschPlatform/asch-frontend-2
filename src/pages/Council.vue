<template>
  <q-page padding class="">
      <h5>全部理事会</h5>
      <div class="row">
        <council-snippet></council-snippet>
      </div>
  </q-page>
</template>
<script>
import { QPage, QCard, QCardTitle } from 'quasar'
import councilSnippet from '../components/CouncilSnippet'

export default {
  name: 'Council',
  data() {
    return {}
  },
  components: {
    QPage,
    QCard,
    QCardTitle,
    councilSnippet
  }
}
</script>
<style lang="stylus" scoped>
</style>