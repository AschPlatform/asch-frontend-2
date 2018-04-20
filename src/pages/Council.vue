<template>
  <q-page padding class="">
      <h5>{{$t('COUNCILS')}}</h5>
      <div class="row">
        <council-snippet v-for="(item, idx) in councils" :item="item" :key="idx" @callModal="switchModal"></council-snippet>
      </div>

      <!-- CouncilModal -->
      <council-modal v-if="this.activeItem !== {}" :item="activeItem" :show="isModalShow" @callModal="switchModal"></council-modal>
  </q-page>
</template>
<script>
import { QPage, QCard, QCardTitle } from 'quasar'
import councilSnippet from '../components/CouncilSnippet'
import councilModal from '../components/CouncilModal'
import { mapActions } from 'vuex'

export default {
  name: 'Gateway',
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
      debugger
      this.activeItem = val.item
    },
    async getAllCouncils() {
      let context = {}
      let result = await this.getCouncils(context)
      if (result.success) {
        this.councils = result.councils
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
