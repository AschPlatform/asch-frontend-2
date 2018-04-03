<template>
  <q-modal content-classes="row justify-center" v-model="show" maximized :no-esc-dismiss="true">
    <q-modal-layout>
        <q-toolbar slot="header">
          <q-toolbar-title>
           {{$t('ASSET_DETAIL',{currency:asset.currency})}}
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer">
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
          
          <assets-panel type='inner' :asset="asset" @transfer="transfer"/>
          <assets-panel type='outer' :asset="asset" @transfer="transfer" @deposit="deposit" @withdraw="withdraw"/>
          <q-card class="col-4">
            <q-card-main>
              <table>
                <tr>
                  <td>{{$t('ISSUER')}}</td>
                  <td>{{asset.issuerName}}</td>
                </tr>
                <tr>
                  <td>{{$t('DAPP_COIN_TOTAL_AMOUNT')}}</td>
                  <td>{{asset.quantityShow}}</td>
                </tr>
                <tr>
                  <td>{{$t('DAPP_COIN_CURRENT_QUANTITY')}}</td>
                  <td>{{asset.maximumShow}}</td>
                </tr>
              </table>
            </q-card-main>
          </q-card>
          <q-card class="col-4">
            <q-card-main>
              <p>
                desc
              </p>
            </q-card-main>
          </q-card>

        </div>
        <div>
          <trans-record-container :userInfo="userInfo" :currency="asset.currency" />
        </div>
   </q-modal-layout>
  </q-modal>
</template>
<script>
import { mapActions } from 'vuex'
import TransRecordContainer from '../components/TransRecordContainer'
import AssetsPanel from './AssetsPanel'

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
  props: ['asset', 'show', 'userInfo'],
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
    TransRecordContainer,
    AssetsPanel
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
  mounted() {},
  methods: {
    ...mapActions(['getMoreAssets']),
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
    }
  },
  computed: {},
  watch: {
  }
}
</script>
<style lang="stylus" scoped>
</style>