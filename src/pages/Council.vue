<template>
  <q-page class="council-container">
    <div class="council-top">
      <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
      <span class="font-22 text-black vertical-align-middle">{{$t('COUNCILS')}}</span>
    </div>
    <div class="row gutter-sm">
      <council-snippet class="col-md-4 col-xs-12"  v-for="(item, idx) in councils" :item="item" :key="idx" @callModal="switchModal"/>
      <q-btn :disabled="loading" v-if="pagination.rowsNumber>councils.length" :label="$t('LOAD_MORE')" @click="loadMore" />
    </div>
  </q-page>
</template>
<script>
import { QPage, QCard, QCardTitle } from 'quasar'
import CouncilSnippet from '../components/CouncilSnippet'
import CouncilModal from '../components/CouncilModal'
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
      },
      loading: false,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      }
    }
  },
  components: {
    QPage,
    QCard,
    QCardTitle,
    CouncilSnippet,
    CouncilModal
  },
  mounted() {
    this.getAllCouncils()
  },
  methods: {
    ...mapActions(['getCouncils']),
    switchModal(val) {
      this.$router.push({ name: 'councilDetail', params: { val } })
    },
    async getAllCouncils() {
      this.loading = true
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let result = await this.getCouncils({
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      if (result.success) {
        this.councils = result.councils
        this.pagination.rowsNumber = result.count
      }
      this.loading = false
    },
    loadMore() {
      this.pagination.page++
      this.getAllCouncils()
    }
  }
}
</script>
<style lang="stylus" scoped>
.council-container
  padding 20px

.council-top
  margin-bottom 20px

.q-table-top
  background #e7ebee !important
</style>
