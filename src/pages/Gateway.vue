
<template>
  <q-page padding class="">
    <div class="geteway-top">
      <i class="material-icons vertical-align-middle font-24 text-secondary">person</i>
      <span class="font-24 text-black">{{$t('GATEWAY')}}</span>
    </div>
    <div class="row">
      <gateway-item class="bg-white" v-for="(item, idx) in gateways" :item="item" :key="idx" @open="showDetail" />
      <q-btn :disabled="loading" v-if="pagination.rowsNumber>gateways.length" :label="$t('LOAD_MORE')" @click="loadMore" />
    </div>
    <!-- CouncilModal -->
    <gateway-modal v-if="gateway" :item="gateway" :show="show" @close="show=false" />
  </q-page>
</template>

<script>
import { QPage, QCard, QCardTitle } from 'quasar'
import GatewayItem from '../components/GatewayItem'
import GatewayModal from '../components/GatewayModal'
import { mapActions } from 'vuex'

export default {
  name: 'Gateway',
  data() {
    return {
      gateways: [],
      // modal
      show: false,
      activeItem: {},
      loading: false,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      gateway: {}
    }
  },
  components: {
    QPage,
    QCard,
    QCardTitle,
    GatewayItem,
    GatewayModal
  },
  mounted() {
    this.getData()
  },
  methods: {
    ...mapActions(['getGateways']),
    showDetail(gateway) {
      this.show = true
      this.gateway = gateway
    },
    async getData() {
      this.loading = true
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await this.getGateways({
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      if (res.success) {
        this.gateways = res.gateways
        this.pagination.rowsNumber = res.count
      }
      this.loading = false
    },
    loadMore() {
      this.pagination.page++
      this.getData()
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>

.geteway-top {
  margin-bottom: 20px;
}
</style>