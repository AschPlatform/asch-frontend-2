<template>
  <q-page padding class="">
      <h5>{{$t('COUNCILS')}}</h5>
      <div class="row">
        <council-snippet v-if="councils !== []" v-for="(item, idx) in councils" :item="item" :key="idx" @callModal="switchModal"></council-snippet>
      </div>

      <!-- CouncilModal -->
      <council-modal :item="activeItem" :show="isModalShow" @callModal="switchModal"></council-modal>
  </q-page>
</template>
<script>
import { QPage } from 'quasar'
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
      activeItem: {
        members: []
      }
    }
  },
  components: {
    QPage,
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
      if (result.success) {
        this.councils = result.councils
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
