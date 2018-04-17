<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div v-if="user" class="layout-padding self-center">
    <div class="row gutter-xs col-12">
      <div class="col-12 col-auto  col-xs-12">
        <q-card>
          <q-card-main class="row">
            <div class="col-6">
              <jdenticon  :address="user.account.address" :size="60" />
            </div>
            <div  class="col-6">
              <q-btn size="xs" :label="$t('TRS_TYPE_TRANSFER')" flat  @click="$root.$emit('openTransactionDialog',{currency:'XAS',precision:8})" />
              <q-btn size="xs" :label="$t('RECEIVE')"  flat   @click="showAddrQr" />
            </div>
          </q-card-main>
        </q-card>
      </div>
    </div>
  
    <div class="row col shadow-1 ">
      <div class="col-5 balance-panel" >
        <q-card >
          <q-card-title>
            {{$t('BALANCE')}}
          </q-card-title>
           <q-card-main >
             {{userInfo.account.xas | fee}}
             {{$t('MAIN_ASSET')+'XAS'}}
             <div>  
             {{address}}
              <q-btn v-clipboard="address || 'no data'" @success="info('copy senderId success...')" size="xs"  flat round icon="compare arrows" />
             </div>
             <div class="row justify-center" @click="showAddrQr">
               <vue-qr :size="100" :text="address"></vue-qr>
             </div>
           </q-card-main>
          <q-card-main >
            <q-list v-if="balances.length" highlight>
              <q-item v-for="(balance,idx) in  balances" :key="idx">
                <q-item-side>
                  <q-item-tile avatar>
                    <img :src="null">
                  </q-item-tile>
                </q-item-side>
                <q-item-main :label="balance.currency" />
                <q-item-side right>
                  <q-item-tile >
                    {{balance.balance | fee(balance.precision)}}
                    <q-btn flat round icon="arrow forward" @click="$router.push({name:'assets',params:{asset:balance}})" />
                  </q-item-tile>
                </q-item-side>
              </q-item>
            </q-list>
            <q-btn @click="assets" flat size="xs" :label="$t('SEE_ALL_ASSETS')" icon="compare arrows" />
          </q-card-main>
        </q-card>
      </div>
        <div class="col-7">
          <trans-record-container  :userInfo="userInfo" />
        </div>
    </div>
    
  </div>
</template>

<script>
import Jdenticon from '../components/Jdenticon'
import TransRecordContainer from '../components/TransRecordContainer'
import { toast } from '../utils/util'
import VueQr from 'vue-qr'
import { mapGetters } from 'vuex'
import {
  QCard,
  QCardMain,
  QCardTitle,
  QModal,
  QTable,
  QTd,
  QBtn,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile
} from 'quasar'

export default {
  props: ['userObj'],
  components: {
    VueQr,
    Jdenticon,
    QCard,
    QCardMain,
    QCardTitle,
    QModal,
    QTable,
    QTd,
    QBtn,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    TransRecordContainer
  },
  data() {
    return {
      refreshLoading: false
    }
  },
  methods: {
    refreshBalance(e, done) {
      this.refreshLoading = true
      this.$root.$emit('refreshAccount', () => (this.refreshLoading = false))
    },
    showAddrQr() {
      this.$root.$emit('showQRCodeModal', this.address)
    },
    assets() {
      this.$router.push('assets')
    },
    info(msg) {
      toast(msg)
    },
    // get transactions
    receive() {}
  },
  mounted() {},
  computed: {
    ...mapGetters(['userInfo', 'balances']),
    user() {
      return this.userInfo
    },
    address() {
      return this.userInfo && this.userInfo.account ? this.userInfo.account.address : 'nothing'
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
.balance-panel {
  min-height: 200px;
}
</style>
