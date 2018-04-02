<template>
  <q-page padding>
    <big>
      {{$t('ASSET_PROFILE')}}
    </big>
    <q-card  >
        <q-card-title>
          {{$t('X_ASSETS')}}
        </q-card-title>
          <q-card-main class="row gutter-xs">
            <assets-panel v-for="(balance ,idx) in innerBalance" :key="idx" type='inner' :asset="balance" @transfer="transfer" @open="open"/>
          </q-card-main>
      </q-card>
    <q-card  >
      <q-card-title>
        {{$t('CROSS_ASSETS')}}
      </q-card-title>
        <q-card-main class="row gutter-xs">
        <assets-panel v-for="(balance ,idx) in innerBalance" :key="idx" type='outer' :asset="balance" @transfer="transfer"  @deposit="deposit"  @withdraw="withdraw"  @open="open"/>
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
    <more-asset-modal :show="moreAssetsModalShow" :assets="innerBalance" 
      @close="moreAssetsModalShow=false" @deposit="depositNewAsset"/>
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
      pagination: {
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
    ...mapActions(['myBalances']),
    // TODO
    async getBalances(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await this.myBalances({
        address: this.user.account.address,
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      if (res.success) {
        this.innerBalance = res.balances
        // set max
        this.pagination.rowsNumber = res.count
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
    }
  },
  mounted() {
    if (this.user) {
      this.getBalances()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    }
  },

  watch: {
    userInfo(val) {
      if (val) {
        this.getBalances()
      }
    },
    pageNo(val) {
      this.getBalances()
    }
  }
  // register event
}
</script>

<style>

</style>
