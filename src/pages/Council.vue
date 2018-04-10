<template>
  <q-page padding class="">
      <h5>全部理事会</h5>
      <div class="row">
        <council-snippet v-for="(item, idx) in councils" :item="item" :key="idx" @callModal="switchModal"></council-snippet>
      </div>

      <!-- CouncilModal -->
      <council-modal :item="activeItem" :show="isModalShow"></council-modal>
  </q-page>
</template>
<script>
import { QPage, QCard, QCardTitle } from 'quasar'
import councilSnippet from '../components/CouncilSnippet'
import councilModal from '../components/CouncilModal'
import { mapActions } from 'vuex'

export default {
  name: 'Council',
  data() {
    return {
      councils: [],
      // modal
      isModalShow: false,
      activeItem: {}
    }
  },
  components: {
    QPage,
    QCard,
    QCardTitle,
    councilSnippet,
    councilModal
  },
  mounted() {
    this.getAllCouncils()
  },
  methods: {
    ...mapActions(['getCouncils']),
    switchModal(val) {
      this.isModalShow = val.status
      this.activeItem = val.item
    },
    async getAllCouncils() {
      let context = {}
      let result = await this.getCouncils(context)
      debugger
      if (result.success) {
        this.councils = result.councils
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>