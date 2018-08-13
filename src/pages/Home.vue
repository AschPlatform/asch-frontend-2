<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div v-if="user" class="home-container self-center">
    <div class="row gutter-xs col-12">
      <div class="home-top col-12 col-auto  col-xs-12">
        <q-card class="bg-white no-shadow">
          <q-card-main class="row shadow-2">
            <div class="col-md-6 col-xs-12 row justify-left">
              <jdenticon class="desktop-only home-jdenticon" :address="user.account.address" :size="60" />
              <div class="home-top-set-nickname">
                <span v-if="!userNickname" class="text-black font-20 vertical-align-middle font-weight">
                      {{$t('HELLO')}}
                      </span>
                <span v-else class="text-black font-20 vertical-align-middle font-weight">
                      {{$t('HELLO')+','}}
                      </span>
                <a class="set-nickname font-14 bg-secondary text-white" v-if="!userNickname" :label="$t('SET_NICKNAME')" @click="toPersonalSetNickname">{{$t('SET_NICKNAME')}}</a> <span v-else class="font-20 vertical-align-middle">{{userNickname}}</span>
                <p class="font-14 text-three">{{$t('HOME_TIPES')}}</p>
              </div>
            </div>
            <div :class="homeTopRightClass">
              <div class="home-top-btn-container">
                <i class="material-icons font-24 vertical-align-middle text-eight">call_missed</i>
                <q-btn class="text-secondary font-18 font-weight" size="xs" :label="$t('TRS_TYPE_TRANSFER')" flat @click="$root.$emit('openTransactionDialog',{currency:'XAS',precision:8})" />
            </div>
            <span class="btn-container-line"></span>
            <div class="home-top-btn-container">
                <i class="material-icons material-icons font-24 vertical-align-middle text-eight">call_missed_outgoing</i>
                <q-btn class="text-secondary font-18 font-weight" size="xs" :label="$t('RECEIVE')" flat @click="showAddrQr" />
            </div>
            </div>
          </q-card-main>
        </q-card>
      
      </div>
    </div>
  
    <div class="home-bottom no-border row col no-shadow">
      <div :class="homeBottomLeftClass">
        <div class="home-bottom-left-container bg-white shadow-1 padding-bottom-30">
          <q-card class="no-shadow">
            <q-card-title>
              <i class="material-icons font-24 vertical-align-middle text-secondary">account_balance_wallet</i>
              <span class="margin-left-10 text-black font-18 font-weight">
               {{$t('BALANCE')}}
              </span>
              <span class="margin-left-10 text-three font-16 font-weight">
                {{$t('MAIN_ASSET')}}
             </span>
              <span class="qr-right-container" @click="showAddrQr">
                <vue-qr class="add-qr-container" :size="20" :text="address"></vue-qr>
             </span>
            </q-card-title>
            <q-card-main>
              <span class="text-secondary font-20 font-weight">
                {{totalBalance}}
              </span>
              <span class="text-secondary font-12">XAS</span>
              <br />
              <div class="border-top row">
                <span v-if="userInfo.account.isLocked === 1" class="text-three font-12 font-weight">
                  {{$t('AVALABLE')}}{{availableBalance}} XAS
                  <br />
                  {{$t('FREEZED') + freezedBalance}} XAS
                </span>
              </div>
  
              <div class="text-three font-12 font-weight">
                {{address}}
                <q-btn class="text-secondary font-12" v-clipboard="address || 'no data'" @success="info($t('COPY_SUCCESS'))" size="xs" flat round icon="content copy" />
              </div>
  
            </q-card-main>
            <q-card-main>
              <q-list class="no-border" v-if="balances.length" highlight>
                <q-item class="blances-container shadow-1 bg-white" v-for="(balance,idx) in  balances" :to="{name:'assetDetail',params:{asset:balance, user: userInfo}}"  :key="idx">
                  <q-item-side>
                    <q-item-tile>
                      <asset-icon class="vertical-align-middle q-ml-sm" :iconKey="balance.currency.toUpperCase()"></asset-icon>
                    </q-item-tile>
                  </q-item-side>
                  <q-item-main class="text-five font-16 font-weight" :label="balance.currency" />
                  <q-item-side right>
                    <q-item-tile class="text-five font-16">
                      {{balance.balance | fee(balance.asset.precision)}}
                      <q-btn class="text-secondary" flat round icon="arrow forward" @click="$router.push({name:'assets',params:{asset:balance}})" />
                    </q-item-tile>
                  </q-item-side>
                </q-item>
              </q-list>
              <q-btn class="home-all-btn q-hoverable bg-secondary text-white q-btn-rounded" color="secondary" @click="assets" flat :label="$t('SEE_ALL_ASSETS')" />
            </q-card-main>
          </q-card>
        </div>
      </div>
      <div class="col-md-8 col-xs-12 bg-white shadow-1">
        <trans-record-container :userInfo="userInfo" class="table"/>
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
import AssetIcon from '../components/AssetIcon'
import { convertFee } from '../utils/asch'
import { BigNumber } from 'bignumber.js'
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
  QItemTile,
  QIcon,
  QListHeader,
  QAjaxBar
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
    TransRecordContainer,
    QIcon,
    QListHeader,
    QAjaxBar,
    AssetIcon
  },
  data() {
    return {
      refreshLoading: false,
      isDisable: false
    }
  },
  methods: {
    refreshBalance(e, done) {
      this.refreshLoading = true
      this.$root.$emit('refreshAccount', () => (this.refreshLoading = false))
    },
    toPersonalSetNickname() {
      this.$router.push('personal')
    },
    showAddrQr() {
      this.$root.$emit('showQRCodeModal', this.address)
    },
    assets() {
      this.$router.push('assets')
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
    // get transactions
    receive() {}
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['userInfo', 'balances']),
    totalBalance() {
      let a = new BigNumber(convertFee(this.userInfo.account.xas))
      let b = new BigNumber(convertFee(this.userInfo.account.weight))
      return a.plus(b).toNumber()
    },
    freezedBalance() {
      return new BigNumber(convertFee(this.userInfo.account.weight)).toNumber()
    },
    availableBalance() {
      let a = new BigNumber(this.totalBalance)
      let b = new BigNumber(this.freezedBalance)
      let c = a.minus(b).toNumber()
      return c
    },
    homeTopRightClass() {
      return this.isDesk
        ? 'col-md-6 col-xs-12 row justify-end items-center'
        : 'col-md-6 col-xs-12 row justify-center items-center'
    },
    homeBottomLeftClass() {
      return this.isDesk
        ? 'col-md-4 col-xs-12 padding-right-20 balance-panel'
        : 'col-md-4 col-xs-12 padding-right-0 margin-bottom-20'
    },
    user() {
      return this.userInfo
    },
    userNickname() {
      return this.user.account.name
    },
    address() {
      return this.userInfo && this.userInfo.account ? this.userInfo.account.address : 'nothing'
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
.home-container {
  padding: 20px;
}

.balance-panel {
  min-height: 500px;
}

.home-top {
  margin-bottom: 20px;
}

.home-jdenticon {
  margin-left: 10px;
  vertical-align: top;
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
  background: #fafafa !important;
}

.blances-container {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 6px;
}

.home-all-btn {
  float: right;
}

.q-btn {
  min-height: 0 !important;
}

.home-top-set-nickname {
  height: 100%;
  vertical-align: text-bottom;
  display: inline-block;
  margin-left: 20px;
}

.set-nickname {
  width: 110px;
  padding: 4px 16px;
  border-radius: 15px;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  vertical-align: text-top;
}

.q-table-title {
  font-weight: 600 !important;
}

.table {
  height 100%
}

.border-top {
  margin-top 7px;
  margin-bottom 7px;
}
</style>
