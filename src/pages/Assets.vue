<template>
  <q-page class="assets-container">
    <q-card class="assets-container-top no-shadow">
      <q-card-title>
        <i class="material-icons font-30 vertical-align-middle text-secondary ">person</i>
        <span class="font-20 text-black">
                   {{$t('X_ASSETS')}}
              </span>
      </q-card-title>
      <q-card-main class="row justify-left gutter-md">
        <assets-panel :class="innerClass" :asset="xasBalance" @transfer="transfer" @deposit="deposit" @withdraw="withdraw" @open="open" type="inner" />
  
        <assets-panel :class="innerAllClass" v-for="(balance ,idx) in innerBalance" :key="idx" type='inner' :asset="balance" @transfer="transfer" @open="open" />
        <div v-if="innerPagination.rowsNumber>innerBalance.length"  :class="innerBtnClass">
          <q-btn class="bg-white custom-focus-none" :label="$t('LOAD_MORE')" @click="loadMoreInner" no-ripple />
        </div>
      </q-card-main>
    </q-card>
    <q-card class="assets-container-bottom no-shadow">
      <q-card-title>
        <i class="material-icons font-30 text-secondary vertical-align-middle">person</i>
        <span class="font-20 text-black">
                 {{$t('CROSS_ASSETS')}}
                </span>
      </q-card-title>
      <q-card-main :class="cardMainClass">
        <assets-panel :class="innerAllClass" v-for="(balance ,idx) in outerBalance" :key="idx" type='outer' :revoked="balance.asset.revoked" :asset="balance" @transfer="transfer" @deposit="deposit" @withdraw="withdraw" @open="open"/>

        <q-btn v-if="outerPagination.rowsNumber>outerBalance.length" :label="$t('LOAD_MORE')" @click="loadMoreOuter" />
        <q-card :class="outerBtnClass">
          <div class="more-assets-btn row justify-center items-center shadow-1 asset-more-asset-card" @click="moreAssets">
            <span>{{$t('MORE_ASSETS')}}</span>
          </div>
        </q-card>
      </q-card-main>
    </q-card>
  
    <!-- <deposit-modal :user="userInfo" :asset="asset" :show="depositPanelShow" @close="depositPanelShow=false" /> -->
    <deposit-modal @close="depositPanelShow=false" :show='depositPanelShow' :defaultName="selected"/>
  
    <withdraw-modal :user="userInfo" :asset="asset" :show="withdrawPanelShow" @close="withdrawPanelShow=false" />
    <more-asset-modal :show="moreAssetsModalShow" :assets="outerBalance" @close="moreAssetsModalShow=false" @deposit="depositNewAsset" />
  </q-page>
</template>

<script>
import { QBtn, QPage, QCard, QCardMain, QCardTitle } from 'quasar'
import AssetsPanel from '../components/AssetsPanel'
// import DepositModal from '../components/DepositModal'
import WithdrawModal from '../components/WithdrawModal'
import MoreAssetModal from '../components/MoreAssetModal'
import AssetDetailModal from '../components/AssetDetailModal'
import DepositModal from '../components/DepositModal'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['userObj'],
  components: {
    AssetsPanel,
    QBtn,
    QPage,
    QCard,
    QCardMain,
    QCardTitle,
    DepositModal,
    WithdrawModal,
    MoreAssetModal,
    AssetDetailModal
  },
  data() {
    return {
      innerBalance: [],
      outerBalance: [],
      innerPagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      outerPagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      filter: '',
      loading: false,
      depositPanelShow: false,
      withdrawPanelShow: false,
      moreAssetsModalShow: false,
      asset: {},
      selected: {
        symbol: '',
        name: ''
      },
      gatewayInfos: []
    }
  },
  methods: {
    ...mapActions(['getBalances', 'getCurrencies', 'getGateways']),
    // TODO
    async getInner(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.innerPagination = pagination
      let limit = this.innerPagination.rowsPerPage
      let pageNo = this.innerPagination.page
      let res = await this.getBalances({
        address: this.user.account.address,
        limit: limit,
        flag: 2,
        offset: (pageNo - 1) * limit
      })
      if (res.success) {
        this.innerBalance = res.balances
        this.innerBalance.forEach(o => {
          o.precision = o.asset.precision
        })
        // set max
        this.innerPagination.rowsNumber = res.count
        this.loading = false
      }
      return res
    },
    async getOuter(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.innerPagination = pagination
      let limit = this.outerPagination.rowsPerPage
      let pageNo = this.outerPagination.page
      let res = await this.getBalances({
        address: this.user.account.address,
        limit: limit,
        flag: 3,
        offset: (pageNo - 1) * limit
      })
      if (res.success) {
        this.outerBalance = res.balances
        // set max
        this.outerPagination.rowsNumber = res.count
        this.loading = false
      }
      return res
    },

    transfer(asset) {
      this.$root.$emit('openTransactionDialog', asset)
    },
    deposit(asset) {
      this.selected = asset.asset.symbol
      // this.selected.gateway = asset.asset.gateway
      this.selected = {
        symbol: asset.asset.symbol,
        name: asset.asset.gateway
      }
      this.depositPanelShow = true
      asset.haveAdd = true // mark as have address asset
      asset.symbol = asset.name // mark as have address asset
      this.asset = this._.merge({}, asset)
    },
    depositNewAsset(asset) {
      this.selected = {
        symbol: asset.symbol,
        name: asset.gateway
      }
      this.asset = this._.merge({}, asset)
      this.moreAssetsModalShow = false
      this.depositPanelShow = true
    },
    withdraw(asset) {
      this.withdrawPanelShow = true
      this.asset = this._.merge({}, asset)
    },
    moreAssets() {
      this.moreAssetsModalShow = true
    },
    open(asset) {
      this.$router.push({
        name: 'assetDetail',
        params: {
          asset: asset,
          user: this.userInfo
        }
      })
    },
    async getGateway() {
      let resultGateway = await this.getGateways()
      if (resultGateway.success) {
        let tempArray = resultGateway.gateways
        let arr = []
        tempArray.forEach(e => {
          arr[e.name] = e
        })
        this.gatewayInfos = arr
      }
    },
    loadMoreInner() {
      // TODO
    },
    loadMoreOuter() {}
  },
  mounted() {
    if (this.user) {
      this.getInner()
      this.getOuter()
      this.getGateway()
    }
    let asset = this.$route.params.asset
    if (asset) {
      this.asset = asset
      this.assetDetailModalShow = true
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    innerClass() {
      return this.isDesk ? 'assets-panel-container' : 'col-12 assets-panel-container'
    },
    innerAllClass() {
      return this.isDesk ? '' : 'col-12'
    },
    innerBtnClass() {
      return this.isDesk
        ? 'load-more-btn col-4 padding-top-32 text-black'
        : 'load-more-btn col-12 text-black'
    },
    cardMainClass() {
      return this.isDesk
        ? 'row justify-left gutter-md'
        : 'row justify-left gutter-md padding-bottom-60'
    },
    outerBtnClass() {
      return this.isDesk
        ? 'col-auto shadow-2 more-assets-container no-shadow'
        : 'col-12 shadow-2 more-assets-container no-shadow'
    },
    user() {
      return this.userInfo
    },
    balance() {
      return this.user && this.user.account ? this.user.account.xas : 0
    },
    xasBalance() {
      let currency = {
        currency: 'XAS',
        precision: 8,
        balance: this.balance,
        url: ''
      }
      return currency
    }
  },

  watch: {
    userInfo(val) {
      if (val) {
        this.getInner()
        this.getOuter()
        this.getGateway()
      }
    },
    pageNo(val) {
      this.getInner()
      this.getOuter()
    }
  }
  // register event
}
</script>

<style lang="stylus" scoped>
.assets-container {
  background: #e7ebee;
}

.more-assets-container {
  // padding: 0px;
  min-width: 300px;
  height: 161px;
  cursor: pointer;
  background: transparent;
  // margin: 32px;
}

.more-assets {
  height: 100%;
  background: #ffffff;
  margin-top: -15px;
  height: calc(100% + 30px);
}

.more-assets-btn {
  width: 100%;
  height: 161px;
  background: #ffffff;
}

.load-more-btn {
  height: 161px;
  margin-top: 30px;
  min-width: 300px;
  padding-top: 0;
  background: transparent;

  button:hover {
    background: #ffffff !important;
  }

  button {
    width: 100%;
    height: 100%;
    padding: 0;
    background: #ffffff;
  }
}
</style>
