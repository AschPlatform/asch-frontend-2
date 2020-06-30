<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div
    v-if="user"
    class="home-container self-center"
  >
    <div class="row gutter-xs col-12 " >
      <div class="home-top col-12 col-auto  col-xs-12">
        <q-card class="bg-white no-shadow ">
          <q-card-main class="row home-top-panel">
            <div class="col-md-6 col-xs-12 row justify-left q-p">
              <jdenticon
                class="desktop-only home-jdenticon"
                :address="user.account.address"
                :size="90"
              />
              <div class="home-top-set-nickname">
                <span
                  v-if="!userNickname"
                  class="text-primary font-24 vertical-align-middle font-weight "
                >
                  {{$t('HELLO')}}
                </span>
                <span
                  v-else
                  class="text-primary font-24 vertical-align-middle font-weight"
                >
                  {{$t('HELLO')+','}}
                </span>
                <a
                  class="set-nickname font-14 bg-secondary text-white"
                  v-if="!userNickname"
                  :label="$t('SET_NICKNAME')"
                  @click="toPersonalSetNickname"
                >{{$t('SET_NICKNAME')}}</a>
                <span
                  v-else
                  class="font-26 vertical-align-middle primary-color"
                >{{userNickname}}
                </span>
                <p class="font-14 text-secondary margin-top-10 trans-tips">{{$t('HOME_TIPES')}}</p>
              </div>
            </div>
            <div :class="homeTopRightClass">
              <div class="home-top-btn-container " @click="$root.$emit('openTransactionDialog',{currency:'XAS',precision:8})">
<!--                <i class="material-icons font-24 vertical-align-middle text-eight">call_missed</i>-->
                <img :src="transImg" alt=""><br>
                <q-btn
                  class="text-secondary font-16 font-weight"
                  size="xs"
                  :label="$t('TRS_TYPE_TRANSFER')"
                  flat
                  style="padding: 4px 10px"
                />
              </div>
              <div class="home-top-btn-container " @click="showAddrQr">
<!--                <i class="material-icons material-icons font-24 vertical-align-middle text-eight">call_missed_outgoing</i>-->
                <img :src="receiveImg" alt=""><br>
                <q-btn
                  class="text-secondary font-16 font-weight "
                  size="xs"
                  :label="$t('RECEIVE')"
                  flat
                  style="padding: 4px 10px"

                />
              </div>

              <div class="home-top-btn-container " @click="showAddrQr">
<!--                <i class="material-icons material-icons font-24 vertical-align-middle text-eight">call_missed_outgoing</i>-->
                <img :src="coexImg" alt=""><br>
                <q-btn
                  class="text-secondary font-16 font-weight "
                  size="xs"
                  :label="$t('RECEIVE')"
                  flat
                  style="padding: 4px 10px"

                />
              </div>
            </div>
          </q-card-main>
        </q-card>

      </div>
    </div>

    <div class="home-bottom no-border row col no-shadow">
      <div :class="homeBottomLeftClass">
        <div class="home-bottom-left-container bg-white ">
          <q-card class="no-shadow">
            <div class="text-white font-default font-weight title-bg">
              {{$t('BALANCE')}}
            </div>
<!--            <q-card-title>-->
<!--&lt;!&ndash;              <i class="material-icons font-24 vertical-align-middle text-white">account_balance_wallet</i>&ndash;&gt;-->
<!--              <span class="margin-left-10 text-three font-16 font-weight">-->
<!--                {{$t('MAIN_ASSET')}}-->
<!--              </span>-->
<!--            </q-card-title>-->
            <q-card-main class="align-center ">
              <span class="primary-color font-18 font-weight">
                {{totalBalance}}
              </span>
              <br>
              <span class="primary-color font-18 font-weight">
                {{$t('MAIN_ASSET')}}
              </span>
              <span class="primary-color font-18">ECO2</span>
              <br />
              <div class="border-top row">
                <span
                  v-if="userInfo.account.isLocked === 1"
                  class="text-three font-12 font-weight"
                >
                  {{$t('AVALABLE')}}{{availableBalance}} XAS
                  <br />
                  {{$t('FREEZED') + freezedBalance}} XAS
                </span>
              </div>

              <div class="text-three font-12 font-weight just-center ">
                <div
                  class="qr-container"
                  @click="showAddrQr"
                  style="width: 42px"
                >
                  <vue-qr
                    class="add-qr-container"
                    :size="60"
                    :text="address"
                  ></vue-qr>
                </div>
                <div class="text-secondary font-13" style="margin: 5px 0px; word-break: break-all; text-align: left">
                  {{address}}
                </div>
                <div>
                  <q-btn
                    class="text-secondary font-12"
                    v-clipboard="address || 'no data'"
                    @success="info($t('COPY_SUCCESS'))"
                    size="xs"
                    flat
                    round
                    icon="content copy"
                  />
                </div>

              </div>

            </q-card-main>
            <q-card-main>
              <q-list
                class="no-border"
                v-if="balances.length"
                highlight
              >
                <q-item
                  class="blances-container bg-white"
                  v-for="(balance,idx) in  balances"
                  :to="{name:'assetDetail',params:{asset:balance, user: userInfo}}"
                  :key="idx"

                >
                  <q-item-side>
                    <q-item-tile>
                      <asset-icon
                        class="vertical-align-middle q-ml-xs"
                        :iconKey="balance.currency.toUpperCase()"
                        :size="36"
                      ></asset-icon>
                    </q-item-tile>
                  </q-item-side>
                  <q-item-main
                    class="text-primary font-16 font-weight margin-left-20"
                    :label="balance.currency"
                  />
                  <q-item-side right>
                    <q-item-tile class="text-primary font-16" @click="$router.push({name:'assets',params:{asset:balance}})">
                      {{balance.balance | fee(balance.asset.precision)}}
                    </q-item-tile>
                  </q-item-side>
                </q-item>
              </q-list>
              <div class="just-center" style="float: bottom">
                <q-btn
                  class="home-all-btn q-hoverable bg-secondary text-white "
                  color="secondary"
                  @click="assets"
                  flat
                  :label="$t('SEE_ALL_ASSETS')"
                />
              </div>

            </q-card-main>
          </q-card>
        </div>
      </div>
      <div class="col-md-8 col-xs-12 bg-white ">
        <trans-record-container
          :userInfo="userInfo"
          class="table"
        />
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
import transImg from '../assets/transfer.png'
import receiveImg from '../assets/receive.png'
import coexImg from '../assets/coex.png'

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
      isDisable: false,
      transImg,
      receiveImg,
      coexImg
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
      this.$root.$emit('showQRCodeModal', this.address, this.$t('QR_RECEIVE'))
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

.title-bg{
  width 106px
  height 26 !important
  line-height 26px
  background linear-gradient(90deg, rgba(81,187,169,1), rgba(62,159,255,1))
  border-radius 2px 20px 0 0 !important
  text-align center
  margin-bottom 30px
}
.home-container {
  padding: 30px 40px;
}

.balance-panel {
  min-height: 500px;
}

.home-top-panel{
  height : 150px;
  padding : 30px 20px;

}

.trans-tips {
  height : 32px;
  line-height :32px;
  border-radius :2px;
  background-color rgba(246,249,251,1)
  padding:0 10px;
}

.home-top {
  margin-bottom: 10px;
}

.home-jdenticon {

  vertical-align: top;
  border-radius: 60px;
  height :90px;
  width : 90px;
}

.home-top-btn-container:hover i {
  color: #43aea8 !important;
  font-weight : 500
}

.home-top-btn-container {
  /*display: inline-block;*/
  display block
  justify-content space-between
  margin 0 15px
}

.btn-container-line {
  margin: 0 20px;
  display: inline-block;
  width: 1px;
  height: 30px;
  background: #ccc;
}

.home-bottom-left-container {
  height: calc(100% - 30px) !important

}

.qr-container {
  cursor: pointer;
}

.add-qr-container {
  display: inline-block;
  vertical-align: text-top !important;
  margin -10px
}

.blances-container:hover {
  background: #fafafa !important;
}

.blances-container {
  padding-left: 0px !important;
  padding-right: 0px !important;
  margin-bottom: 30px;
  cursor: pointer;
  border-radius: 6px;
  height 36px

}

.home-all-btn {
  align-self center
}

.q-btn {
  min-height: 0 !important;
}

.home-top-set-nickname {
  height : 90px
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
  height: 100%;
}

.border-top {
  margin-top: 7px;
  margin-bottom: 7px;
}
</style>
