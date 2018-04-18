<template>
  <q-modal content-classes="row justify-center" v-model="show" maximized :no-esc-dismiss="true">
    <q-modal-layout>
        <q-toolbar class="bg-secondary" slot="header">
          <q-toolbar-title>
           {{$t('ASSET_DETAIL',{currency:asset.currency})}}
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar class="bg-secondary" slot="footer">
          <q-btn flat :label="$t('label.close')" @click="close"/>
        </q-toolbar>
        <div class="row layout-padding">
          <!-- <q-card class="col-6">
            <q-card-title>
              {{$t('BALANCE')}}
            </q-card-title>
            <q-card-main>
              {{asset.balance | fee}}{{asset.currency}}
            </q-card-main>
            <q-card-actions>
              <q-btn flat :label="$t('TRS_TYPE_TRANSFER')" @click="transfer" />
            </q-card-actions>
          </q-card> -->
          
          <assets-panel v-if="!isCross" type='inner' :asset="asset" @transfer="transfer"/>
          <assets-panel v-else type='outer' :asset="asset" @transfer="transfer" @deposit="deposit" @withdraw="withdraw"/>
          <q-card v-if="isCross && address">
            <q-card-main>
              <p>{{$t('DEPOSIT')}}{{$t('ADDRESS')}}</p>
              <div>
                {{address}} 
                <q-btn v-clipboard="address || 'no data'" @success="info('copy senderId success...')" size="xs"  flat round icon="compare arrows" />
              </div>
               <div class="row justify-center" @click="showAddrQr">
               <vue-qr :size="100" :text="address"></vue-qr>
             </div>
            </q-card-main>
          </q-card>
          <q-card v-if="assetDetail" class="col-4">
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

          <q-card v-if="asset.asset" class="col-4">
            <q-card-main>
              <p>
                {{asset.asset.desc}}
              </p>
            </q-card-main>
          </q-card>

        </div>
        <div>
          <asset-record-container :isCross="isCross" :currency="asset.currency" />
        </div>
   </q-modal-layout>
  </q-modal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import AssetRecordContainer from '../components/AssetRecordContainer'
import AssetsPanel from './AssetsPanel'
import VueQr from 'vue-qr'

import {
  QModal,
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
  QBtn
} from 'quasar'
import { secondPwd } from '../utils/validators'
import { required, minValue } from 'vuelidate/lib/validators'
import { toast } from '../utils/util'

export default {
  name: 'AssetDetailModal',
  props: ['asset', 'show'],
  components: {
    QModal,
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
    if (this.isCross) {
      await this.getAsset()
    }
  },
  methods: {
    ...mapActions(['getMoreAssets', 'getAsset']),
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
      if (this.asset.symbol) {
        return true
      } else {
        return false
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