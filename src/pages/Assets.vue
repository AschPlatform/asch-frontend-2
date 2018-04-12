<template>
  <q-page padding>
    <big>
      {{$t('ASSET_PROFILE')}}
    </big>
    <q-card >
        <q-card-title>
          {{$t('X_ASSETS')}}
        </q-card-title>
          <q-card-main class="row gutter-xs">
            <assets-panel :asset="xasBalance" @transfer="transfer"  @deposit="deposit"  @withdraw="withdraw"  @open="open" type="inner"/>
            <assets-panel v-for="(balance ,idx) in innerBalance" :key="idx" type='inner' :asset="balance" @transfer="transfer" @open="open"/>
            <q-btn v-if="innerPagination.rowsNumber>innerBalance.length" :label="$t('LOAD_MORE')" @click="loadMoreInner" />
          </q-card-main>
      </q-card>
    <q-card >
      <q-card-title>
        {{$t('CROSS_ASSETS')}}
      </q-card-title>
        <q-card-main class="row gutter-xs">
        <assets-panel v-for="(balance ,idx) in innerBalance" :key="idx" type='outer' :asset="balance" @transfer="transfer"  @deposit="deposit"  @withdraw="withdraw"  @open="open"/>
        <q-btn v-if="outerPagination.rowsNumber>outerBalance.length" :label="$t('LOAD_MORE')" @click="loadMoreOuter" />
        <q-card class="col-4" >
          <q-card-main>
            <div @click="moreAssets" >
              {{$t('MORE_ASSETS')}}
            </div>
          </q-card-main>
        </q-card>
        </q-card-main>
    </q-card>

    <deposit-modal :user="userInfo" :assets="innerBalance" :asset="asset" 
      :show="depositPanelShow" :haveAdd="true" @close="depositPanelShow=false" />
    <withdraw-modal :user="userInfo" :assets="innerBalance" :asset="asset" 
      :show="withdrawPanelShow" :haveAdd="true" @close="withdrawPanelShow=false" />
    <more-asset-modal :show="moreAssetsModalShow" @close="moreAssetsModalShow=false" @deposit="depositNewAsset"/>
    <asset-detail-modal :show="assetDetailModalShow" :asset="asset" 
      @close="assetDetailModalShow=false" :userInfo="userInfo"
      @transfer="transfer" @deposit="deposit"  @withdraw="withdraw"  />

  </q-page>
</template>

<script>
import { QPage, QCard, QCardMain, QCardTitle } from 'quasar'
import AssetsPanel from '../components/AssetsPanel'
import DepositModal from '../components/DepositModal'
import WithdrawModal from '../components/WithdrawModal'
import MoreAssetModal from '../components/MoreAssetModal'
import AssetDetailModal from '../components/AssetDetailModal'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['userObj'],
  components: {
    AssetsPanel,
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
      assetDetailModalShow: false,
      asset: {}
    }
  },
  methods: {
    ...mapActions(['getBalances', 'getCurrencies']),
    // TODO
    async getInner(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.innerPagination = pagination
      let limit = this.innerPagination.rowsPerPage
      let pageNo = this.innerPagination.page
      let res = await this.getBalances({
        address: this.user.account.address,
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      if (res.success) {
        this.innerBalance = res.balances
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
      this.depositPanelShow = true
      this.asset = asset
      console.log('deposit', asset)
    },
    depositNewAsset(asset) {
      this.moreAssetsModalShow = false
      this.depositPanelShow = true
      this.asset = asset
      console.log('deposit', asset)
    },
    withdraw(asset) {
      this.withdrawPanelShow = true
      this.asset = asset
      console.log('withdraw', asset)
    },
    moreAssets() {
      this.moreAssetsModalShow = true
    },
    open(asset) {
      this.asset = asset
      this.assetDetailModalShow = true
    },
    loadMoreInner() {},
    loadMoreOuter() {}
  },
  mounted() {
    if (this.user) {
      this.getInner()
      this.getOuter()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
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

<style>

</style>
