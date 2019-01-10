<template>
  <q-page>
    <!-- <tip-bar v-show="isShowTip && isCross && ratio < 120 && ratio !== 0" class="padding-20" :ratio="ratio" :status="status" :symbol="asset.currency"></tip-bar> -->
    <q-card class="no-shadow">
      <q-card-title>
        <div class="row justify-between">
          <div>
            <i class="material-icons vertical-align-middle text-secondary font-22">person</i>
            <span class="vertical-align-middle font-22">{{$t('ASSET_DETAIL',{currency:asset.currency})}}</span>
          </div>
          <q-btn color="secondary" icon="reply" class="row items-center" @click="back">
          </q-btn>
        </div>
     
      </q-card-title>
      <q-card-main :class="assetCardsContainerClass">
        <assets-panel :class="assetDetailInnerClass" v-if="!isCross && status !== 3 && status !== 4" type='inner' :asset="asset" @transfer="transfer"  />

        <assets-panel :class="assetDetailInnerClass" v-if="isCross && status !== 3 && status !== 4" type='outer-simple' :asset="asset" @transfer="transfer" @withdraw="withdraw" />

        <assets-panel :class="assetDetailInnerClass" v-if="status === 3" type='outer-compensate' :asset="asset" @compensate="compensate"/>

        <assets-panel :class="assetDetailInnerClass" v-if="status === 4" type='outer-constrated' :asset="asset" @transfer="transfer" @withdraw="withdraw"/>

        <q-card :class="assetDetailOuterClass" v-if="isCross">
          <q-card-main>
            <p class="font-22 text-black margin-b-0">{{$t('DEPOSIT')}}{{$t('ADDRESS')}}</p>
            <!-- <div v-if="status === 4">
              <span class="font-14 text-three">{{address}}</span>
              <span>{{$t('CAN_NOT_DEPOSIT')}}</span>
            </div> -->
            <div v-if="status === 3 || status === 4">
              <span class="font-14 text-three">{{address}}</span>
              <span>{{$t('CAN_NOT_DEPOSIT')}}</span>
            </div>
            <div v-if="status === 1">
              <span class="font-14 text-three">{{address}}</span>
              <q-btn v-if="address" v-clipboard="address || 'no data'" @success="info($t('COPY_SUCCESS'))" color="secondary" size="xs" flat round icon="content copy" />
              <span v-else>{{$t(gatewayVersionChange?'ERR_GATEWAY_ACCOUNT_DEPRECATE':'NOT_OPEN')}}</span>
            </div>
            <div v-if="status === 1 && !isCross" class="row justify-center" @click="showAddrQr">
              <vue-qr v-if="isCross" :size="80" :text="address ? asset.currency + ':'+ address : 'no data'"></vue-qr>
              <vue-qr v-else :size="80" :text="address || 'no data'"></vue-qr>
            </div>
            <div v-if="status === 2">
              <div class="warn-wrap text-negative text-center q-mt-md">
                <q-icon name="report_problem" size="42px" class="block"></q-icon>
                <p class="font-18">{{$t('TEMP_CLOSE')}}</p>
              </div>
            </div>
          </q-card-main>
        </q-card>

        <q-card v-if="!isCross && assetDetail" :class="assetDetailOuterClass">
          <q-card-main>
            <table>
              <tr class="margin-top-20">
                <td>{{$t('ISSUER')+':'}}</td>
                <td>{{issuerName}}</td>
              </tr>
              <tr class="margin-top-20">
                <td>{{$t('DAPP_COIN_TOTAL_AMOUNT')+':'}}</td>
                <td>{{assetDetail.maximum | fee(assetDetail.precision)}}</td>
              </tr>
              <tr class="margin-top-20">
                <td>{{$t('DAPP_COIN_CURRENT_QUANTITY')+':'}}</td>
                <td>{{assetDetail.quantity | fee(assetDetail.precision) }}</td>
              </tr>
            </table>
          </q-card-main>
        </q-card>
  
        <q-card v-if="asset.asset && status !== 3" :class="assetDetailOuterClass" style="overflow-y: scroll; overflow-x: scroll; max-width: 400px;">
          <q-card-main>
            <p class="text-black font-22">{{$t('CURRENCY_INTRODUCE')}}</p>
            <p class="break-word">
              {{asset.asset.desc}}
            </p>
          </q-card-main>
        </q-card>
      </q-card-main>
    </q-card>
    <div class="asset-detail-record-container">
      <asset-record-container class="bg-white" :isCross="isCross" :currency="asset.currency" />
    </div>
     <deposit-modal :show="depositPanelShow" @close="depositPanelShow=false" :defaultName="symbol"/>
    <withdraw-modal :user="userInfo" :asset="asset" :show="withdrawPanelShow" @close="withdrawPanelShow=false" />
    <prompt-modal :show="compensateModalShow" :title="modal.title" :type="modal.type" :gateway="gatewayInfo" @submit="compensateSubmit" @close="compensateModalShow=false" />
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AssetRecordContainer from '../components/AssetRecordContainer'
import AssetsPanel from '../components/AssetsPanel'
import VueQr from 'vue-qr'
import DepositModal from '../components/DepositModal'
import WithdrawModal from '../components/WithdrawModal'
// import TipBar from '../components/TipBar'

import {
  QModalLayout,
  QToolbar,
  QToolbarTitle,
  QSearch,
  QCard,
  QCardTitle,
  QCardMain,
  QItem,
  QItemSide,
  QItemTile,
  QCardActions,
  QBtn,
  QPage,
  QIcon
} from 'quasar'
import { secondPwd } from '../utils/validators'
import { required, minValue } from 'vuelidate/lib/validators'
import { toast, translateErrMsg } from '../utils/util'
import PromptModal from '../components/PromptModal'

export default {
  name: 'AssetDetail',
  props: [],
  components: {
    QPage,
    QModalLayout,
    QToolbar,
    QToolbarTitle,
    QSearch,
    QCard,
    QCardTitle,
    QCardMain,
    QItem,
    QItemSide,
    QItemTile,
    QCardActions,
    QBtn,
    AssetRecordContainer,
    AssetsPanel,
    VueQr,
    DepositModal,
    WithdrawModal,
    QIcon,
    PromptModal
  },
  data() {
    return {
      asset: {},
      filter: '',
      address: '',
      bailInfo: {},
      depositPanelShow: false,
      withdrawPanelShow: false,
      isDisable: false,
      isShowTip: true,
      compensateModalShow: false,
      gatewayVersionChange: false,
      modal: {
        title: 'RESERVE_COMPENSATION_LABEL',
        type: 3
      },
      gatewayInfo: {
        bail: null,
        status: null,
        claim: null
      },
      runningInfo: null
    }
  },
  validations: {
    form: {
      address: {
        required
      },
      amount: {
        required,
        minValue: minValue(1)
      },
      receiver: {
        required
      },
      params: null
    },
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  async mounted() {
    let { asset = null, user = null } = this.$route.params
    if (!asset || !asset.currency) {
      this.$router.push('/assets')
      return null
    }
    this.asset = asset
    this.user = user
    if (asset.currency === 'XAS') {
      this.isShowTip = false
      this.asset = {
        currency: 'XAS',
        balance: user.account.xas
      }
    }
    if (asset && asset.asset) {
      let name = asset.asset.gateway
      let address = user.address
      let res = await this.gateAccountAddr({ name, address })
      if (res.success && res.account) {
        this.address = res.account.outAddress
      } else {
        this.gatewayVersionChange = true
      }

      this.getGateway()
      // this.getRealClaim()
    }
  },
  methods: {
    ...mapActions([
      'getBalance',
      'gateAccountAddr',
      'getGateways',
      'getCompensation'
    ]),
    async getData() {
      // TODO
      let res = await this.getMoreAssets()
      this.close()
      return res
    },
    back() {
      this.$router.back()
    },
    close() {
      this.$emit('close')
    },
    info(msg) {
      if (this.isDisable === true) {
        return
      }
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 2000)
      toast(msg)
    },
    transfer(asset) {
      this.$root.$emit('openTransactionDialog', asset)
    },
    deposit(asset) {
      this.asset = this._.merge({}, asset)
      this.depositPanelShow = true
    },
    withdraw(asset) {
      this.asset = this._.merge({}, asset)
      this.withdrawPanelShow = true
    },
    compensate() {
      this.compensateModalShow = true
    },
    async compensateSubmit(form) {
      let res = null
      let { amount, secondPwd } = form
      let params = {
        name: this.asset.asset.gateway,
        amount,
        secondSecret: secondPwd
      }
      res = await this.getCompensation(params)
      if (res.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
      } else {
        translateErrMsg(this.$t, res.error)
        this.disableBtn('btnDisable')
      }
    },
    showAddrQr() {
      this.$root.$emit(
        'showQRCodeModal',
        this.address && this.isCross ? this.asset.currency + ':' + this.address : this.address
      )
    },
    async getGateway(name) {
      // let result = await this.getGatewayInfo({
      //   name: this.asset.asset.gateway
      // })
      let resultGateway = await this.getGateways()
      if (resultGateway.success) {
        let tempArray = resultGateway.gateways
        tempArray.forEach(e => {
          if (e.name === this.asset.asset.gateway) {
            this.runningInfo = e
          }
        })
      }
    }
    // async getRealClaim() {
    //   let res = await this.getGatewayRealClaim({
    //     name: this.asset.asset.gateway,
    //     address: this.userInfo.address
    //   })
    //   if (res.success) {
    //     this.gatewayInfo.claim = res
    //   }
    // }
  },
  computed: {
    ...mapGetters(['userInfo', 'outAssets']),
    assetDetailInnerClass() {
      return this.isDesk ? 'margin-l-15 col-auto' : 'col-12'
    },
    assetDetailOuterClass() {
      return this.isDesk
        ? 'col-auto bg-white asset-detail-card-desk margin-l-30'
        : 'col-12 bg-white asset-more-asset-card margin-top-20'
    },
    assetCardsContainerClass() {
      return this.isDesk ? 'row col-12 asset-cards-container' : 'row col-12'
    },
    isCross() {
      if (this.asset.currency === 'XAS') return false
      if (this.asset && this.asset.asset && this.asset.asset.issuerId) {
        return false
      } else {
        return true
      }
    },
    assetDetail() {
      return this.asset.asset
    },
    issuerName() {
      if (this.asset.currency) return this.asset.currency.split('.')[0]
    },
    symbol() {
      if (this.asset && this.asset.asset) {
        return this.asset.asset.symbol
      }
    },
    ratio() {
      if (this.bailInfo && this.bailInfo.length > 0) {
        return (this.bailInfo.ratio * 100).toFixed(2)
      }
      return 0
    },
    status() {
      if (this.getGatewayState === 3 || this.getGatewayState === 0) {
        return 4
      }
      if (this.getGatewayState === 4) {
        return 3
      }
      if (this.ratio > 0 && this.ratio < 100) {
        return 2
      }
      return 1
    },
    getGatewayState() {
      /**
       * -1 no gateway data
       * 0 not activated
       * 1 activated
       * 2 online
       * 3 offline
       * 4 freeze
       */
      let gateway = this.runningInfo
      if (gateway) {
        console.log('info:', gateway)
        let { activated, revoked } = gateway
        if (activated === 0) {
          return 0
        }
        if (activated === 1) {
          if (revoked > 0) {
            return revoked + 2
          } else {
            return 2
          }
        }
      }
      return -1
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
.asset-detail-record-container {
  padding: 20px;
}

.margin-l-30 {
  margin-left: 30px;
}

.margin-l-15 {
  margin-left: 5px !important;
}

.assetDetail-card-content {
  min-width: 300px;
  height: 160px;
}

.asset-detail-qr-container {
  overflow: hidden;
}

.asset-cards-container {
  min-width: 1366px;
}

.break-word {
  word-break: break-word;
}
</style>