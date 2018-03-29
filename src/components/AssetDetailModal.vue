<template>
  <q-modal content-classes="row justify-center" v-model="show" maximized>
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
          <q-card class="col-6">
            <q-card-title>
              {{$t('BALANCE')}}
            </q-card-title>
            <q-card-main>
              {{asset.balance | fee}}{{asset.currency}}
            </q-card-main>
            <q-card-actions>
              <q-btn flat :label="$t('TRS_TYPE_TRANSFER')" @click="transfer" />
            </q-card-actions>
          </q-card>
          <q-card class="col-6">
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

        </div>
        <div>
          <trans-record-container :userInfo="userInfo" />
        </div>
   </q-modal-layout>
  </q-modal>
</template>
<script>
import { mapActions } from 'vuex'
import TransRecordContainer from '../components/TransRecordContainer'

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
import { convertFee } from '../utils/asch'

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
    TransRecordContainer
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
      }
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
    assetsInfo(asset) {
      let balance = convertFee(asset.balance, asset.precision)
      return `${asset.currency}   ${balance}   `
    },
    deposit(asset) {
      this.$emit('deposit', asset)
    },
    transfer() {
      this.$root.$emit('openTransactionDialog', this.asset)
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang="stylus" scoped>
</style>