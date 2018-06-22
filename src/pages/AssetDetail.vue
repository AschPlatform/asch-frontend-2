<template>
  <q-page >
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
        <assets-panel :class="assetDetailInnerClass" v-if="!isCross" type='inner' :asset="asset" @transfer="transfer"  />

        <assets-panel :class="assetDetailInnerClass" v-else type='outer' :asset="asset" @transfer="transfer" @deposit="deposit" @withdraw="withdraw" />

        <q-card :class="assetDetailOuterClass" v-if="isCross && address">
          <q-card-main>
            <p class="font-22 text-black margin-b-0">{{$t('DEPOSIT')}}{{$t('ADDRESS')}}</p>
            <div>
              <span class="font-14 text-three">{{address}}</span>
              <q-btn v-clipboard="address || 'no data'" @success="info('copy senderId success...')" color="secondary" size="xs" flat round icon="content copy" />
            </div>
            <div class="row justify-center" @click="showAddrQr">
              <vue-qr v-if="isCross" :size="80" :text="address ? 'bitcoin:'+ address:'no data'"></vue-qr>
              <vue-qr v-else :size="80" :text="address || 'no data'"></vue-qr>
            </div>
          </q-card-main>
        </q-card>

        <q-card v-if="!isCross && assetDetail" :class="assetDetailOuterClass">
          <q-card-main>
            <table>
              <tr class="margin-t-20">
                <td>{{$t('ISSUER')+':'}}</td>
                <td>{{issuerName}}</td>
              </tr>
              <tr class="margin-t-20">
                <td>{{$t('DAPP_COIN_TOTAL_AMOUNT')+':'}}</td>
                <td>{{assetDetail.maximum | fee(assetDetail.precision)}}</td>
              </tr>
              <tr class="margin-t-20">
                <td>{{$t('DAPP_COIN_CURRENT_QUANTITY')+':'}}</td>
                <td>{{assetDetail.quantity | fee(assetDetail.precision) }}</td>
              </tr>
            </table>
          </q-card-main>
        </q-card>
  
        <q-card v-if="asset.asset" :class="assetDetailOuterClass">
          <q-card-main>
            <p class="text-black font-22">{{$t('CURRENCY_INTRODUCE')}}</p>
            <p>
              {{asset.asset.desc}}
            </p>
          </q-card-main>
        </q-card>
      </q-card-main>
    </q-card>
    <div class="asset-detail-record-container">
      <asset-record-container class="bg-white" :isCross="isCross" :currency="asset.currency" />
    </div>
     <deposit-modal :user="userInfo"  :asset="asset" :show="depositPanelShow" @close="depositPanelShow=false" />
    <withdraw-modal :user="userInfo" :asset="asset" :show="withdrawPanelShow" @close="withdrawPanelShow=false" />
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AssetRecordContainer from '../components/AssetRecordContainer'
import AssetsPanel from '../components/AssetsPanel'
import VueQr from 'vue-qr'
import DepositModal from '../components/DepositModal'
import WithdrawModal from '../components/WithdrawModal'

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
  QPage
} from 'quasar'
import { secondPwd } from '../utils/validators'
import { required, minValue } from 'vuelidate/lib/validators'
import { toast } from '../utils/util'

export default {
  name: 'AssetDetailModal',
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
    WithdrawModal
  },
  data() {
    return {
      asset: {},
      filter: '',
      address: '',
      depositPanelShow: false,
      withdrawPanelShow: false,
      isDisable: false
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
      this.asset = {
        currency: 'XAS',
        balance: user.account.xas
      }
    }
    if (asset && asset.asset) {
      let name = asset.asset.gateway
      let address = this.userInfo.address
      let res = await this.gateAccountAddr({ name, address })
      if (res.success && res.account) {
        this.address = res.account.outAddress
      }
    }
  },
  methods: {
    ...mapActions(['getBalance', 'gateAccountAddr']),
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
    showAddrQr() {
      this.$root.$emit(
        'showQRCodeModal',
        this.address && this.isCross ? 'bitcoin:' + this.address : this.address
      )
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    assetDetailInnerClass() {
      return this.isDesk ? 'margin-l-15 col-auto' : 'col-12'
    },
    assetDetailOuterClass() {
      return this.isDesk
        ? 'col-auto bg-white asset-detail-card-h margin-l-30'
        : 'col-12 bg-white asset-detail-card-h margin-top-20'
    },
    assetCardsContainerClass() {
      return this.isDesk
        ? 'row col-12 asset-cards-container'
        : 'row col-12'
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
  min-width: 1376px;
}
</style>