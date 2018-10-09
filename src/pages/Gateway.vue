
<template>
  <q-page class="gateway-container">
    <div class="geteway-top">
      <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
      <span class="font-20 text-black vertical-align-middle">{{$t('ALL_GATEWAY')}}</span>
    </div>
    <div class="row gutter-sm">
      <gateway-item class="col-md-4 col-xs-12"  v-for="(item, idx) in gateways" :item="item" :key="idx" @open="showDetail"/>
      <q-btn :disabled="loading" v-if="pagination.rowsNumber>gateways.length" :label="$t('LOAD_MORE')" @click="loadMore" />
    </div>
  </q-page>
</template>

<script>
import { QPage, QCard, QCardTitle } from 'quasar'
import GatewayItem from '../components/GatewayItem'
import { mapActions, mapGetters } from 'vuex'

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
      }
    }
  },
  components: {
    QPage,
    QCard,
    QCardTitle,
    GatewayItem
  },
  mounted() {
    this.getData()
  },
  methods: {
    ...mapActions(['getGateways']),
    showDetail(gateway) {
      this.$router.push({ name: 'gatewayDetail', params: { gateway } })
    },
    async getData() {
      /**
       * 状态值 state ？（revoked）
       * 未激活  activited 0
       * 激活  activited 1
       * 正常  revoked 0
       * 离线 revoked 1
       * 冻结 revoked 2
       */
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
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>

.gateway-container {
  padding: 20px;
}

.geteway-top {
  margin-bottom: 20px;
}

.q-table-top {
  background: #e7ebee !important;
}
</style>