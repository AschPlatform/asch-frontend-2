<template>
  <q-page >
    <q-card >
      <q-card-title>
        <i class="material-icons vertical-align-middle text-primary font-22">person</i>
        {{$t('ASSET_DETAIL',{currency:asset.currency})}}
      </q-card-title>
      <q-card-main class="row">
        <assets-panel v-if="!isCross" type='inner' :asset="asset" @transfer="transfer"  />
        <assets-panel v-else type='outer' :asset="asset" @transfer="transfer" @deposit="deposit" @withdraw="withdraw" />
        <q-card v-if="isCross && address" class="col-3">
          <q-card-main>
            <p>{{$t('DEPOSIT')}}{{$t('ADDRESS')}}</p>
            <div>
              {{address}}
              <q-btn v-clipboard="address || 'no data'" @success="info('copy senderId success...')" size="xs" flat round icon="compare arrows" />
            </div>
            <div class="row justify-center" @click="showAddrQr">
              <vue-qr :size="100" :text="address"></vue-qr>
            </div>
          </q-card-main>
        </q-card>
        <q-card v-if="assetDetail" class="col-3">
          <q-card-main>
            <table>
              <tr>
                <td>{{$t('ISSUER')}}</td>
                <td>{{issuerName}}</td>
              </tr>
              <tr>
                <td>{{$t('DAPP_COIN_TOTAL_AMOUNT')}}</td>
                <td>{{assetDetail.maximum |fee(assetDetail.precision)}}</td>
              </tr>
              <tr>
                <td>{{$t('DAPP_COIN_CURRENT_QUANTITY')}}</td>
                <td>{{assetDetail.quantity ||fee(assetDetail.precision) }}</td>
              </tr>
            </table>
          </q-card-main>
        </q-card>
  
        <q-card v-if="asset.asset" class="col-3">
          <q-card-main>
            <p>
              {{asset.asset.desc}}
            </p>
          </q-card-main>
        </q-card>
      </q-card-main>
    </q-card>
    <div>
      <asset-record-container :isCross="isCross" :currency="asset.currency" />
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AssetRecordContainer from '../components/AssetRecordContainer'
import AssetsPanel from '../components/AssetsPanel'
import VueQr from 'vue-qr'

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
    VueQr
  },
  data() {
    return {
      asset: {},
      filter: ''
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
  },
  methods: {
    ...mapActions(['getBalance']),
    async getData() {
      // TODO
      let res = await this.getMoreAssets()
      this.close()
      return res
    },
    close() {
      this.$emit('close')
    },
    info(msg) {
      toast(msg)
    },
    transfer(asset) {
      this.$root.$emit('openTransactionDialog', asset)
    },
    deposit(asset) {
      this.$emit('deposit', asset)
      this.close()
    },
    withdraw(asset) {
      this.$emit('withdraw', asset)
      this.close()
    },
    showAddrQr() {
      this.$root.$emit('showQRCodeModal', this.address)
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    isCross() {
      if (this.asset.currency === 'XAS') return false
      if (this.asset && this.asset.asset && this.asset.asset.issuerId) {
        return false
      } else {
        return true
      }
    },
    address() {
      return this.asset && this.asset.address ? this.asset.address : ''
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
</style>