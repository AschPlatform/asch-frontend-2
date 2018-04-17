<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div v-if="user" class="layout-padding self-center">
    <div class="row gutter-xs col-12">
      <div class="home-top col-12 col-auto  col-xs-12">
        <q-card class="bg-white no-shadow">
          <q-card-main class="row shadow-2">
            <div class="col-6">
              <jdenticon class="home-jdenticon" :address="user.account.address" :size="60" />
            </div>
            <div class="col-6 row justify-end items-center">
  
              <div class="home-top-btn-container">
                <i class="material-icons font-24 vertical-align-middle text-eight">fiber_manual_record</i>
                <q-btn class="text-secondary font-24" size="xs" :label="$t('TRS_TYPE_TRANSFER')" flat @click="$root.$emit('openTransactionDialog',{currency:'XAS',precision:8})" />
              </div>
              <span class="btn-container-line"></span>
              <div class="home-top-btn-container">
                <i class="material-icons font-24 vertical-align-middle text-eight">fiber_manual_record</i>
                <q-btn class="text-secondary font-24" size="xs" :label="$t('RECEIVE')" flat @click="showAddrQr" />
              </div>
  
            </div>
          </q-card-main>
        </q-card>
      </div>
    </div>
  
    <div class="home-bottom no-border row col no-shadow">
      <div class="home-bottom-left col-4 balance-panel">
        <div class="home-bottom-left-container bg-white shadow-1">
        <q-card class="no-shadow">
          <q-card-title>
            <i class="material-icons font-24 vertical-align-middle text-secondary">email</i>
            <span class="text-black font-22">
             {{$t('BALANCE')}}
            </span>
            <span class="text-three font-16">
              {{$t('MAIN_ASSET')}}
           </span>
           <span class="qr-right-container" @click="showAddrQr">
              <vue-qr class="add-qr-container" :size="20" :text="address"></vue-qr>
           </span>
          </q-card-title>
          <q-card-main>
            <span class="text-secondary font-30">
              {{userInfo.account.xas | fee}}
              </span>
            <span class="text-secondary font-16">XAS</span>
  
            <div class="text-three font-14">
              {{address}}
              <q-btn class="text-secondary font-12" v-clipboard="address || 'no data'" @success="info('copy senderId success...')" size="xs" flat round icon="content copy" />
            </div>
  
          </q-card-main>
          <q-card-main>
            <q-list class="no-border" v-if="balances.length" highlight>
              <q-item class="blances-container shadow-1 bg-white" v-for="(balance,idx) in  balances" :key="idx">
                <q-item-side>
                  <q-item-tile>
                    <i class="material-icons font-44 vertical-align-middle text-eight">fiber_manual_record</i>
                  </q-item-tile>
                </q-item-side>
                <q-item-main class="text-five font-18" :label="balance.currency" />
                <q-item-side right>
                  <q-item-tile class="text-five font-18">
                    {{balance.balance | fee(balance.precision)}}
                    <q-btn flat round icon="arrow forward" @click="$router.push({name:'assets',params:{asset:balance}})" />
                  </q-item-tile>
                </q-item-side>
              </q-item>
            </q-list>
            <q-btn class="home-all-btn q-hoverable bg-secondary text-white q-btn-rounded" color="secondary" @click="assets" flat :label="$t('SEE_ALL_ASSETS')" />
          </q-card-main>
        </q-card>
        </div>
      </div>
      <div class="col-8 bg-white">
        <trans-record-container :userInfo="userInfo" />
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
.layout-padding {
  padding: 20px !important;
}

.balance-panel {
  min-height: 200px;
}

.home-top {
  margin-bottom: 20px;
}

.home-jdenticon {
  border-radius: 50%;
}

.home-top-btn-container:hover i {
  color: #43aea8 !important;
}

.home-top-btn-container {
  display: inline-block;
}

.btn-container-line {
  margin: 0 20px;
  display: inline-block;
  width: 1px;
  height: 30px;
  background: #ccc;
}

.home-bottom-left {
  padding-right: 20px;
}

.home-bottom-left-container {
  height: 100%;
}

.qr-right-container {
  float: right;
  cursor: pointer;
}

.add-qr-container {
  display: inline-block;
  vertical-align: text-top !important;
}

.blances-container:hover {
  background: #ebebeb;
}

.blances-container {
  margin-bottom: 20px;
  cursor: pointer;
}

.home-all-btn {
  float: right;
}

.q-btn {
  min-height: 0 !important;
}
</style>
