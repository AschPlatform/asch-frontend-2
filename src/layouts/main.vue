<template>
  <q-layout ref="layout" view="lHh Lpr fff">
    <q-layout-header class="no-shadow">
  
      <q-toolbar class="head-top row justify-between bg-white">
        <q-btn flat @click="showLeft=!showLeft">
          <q-icon name="menu" class="text-faded" />
        </q-btn>
  
        <q-btn flat @click="logout">
          <q-icon name="power settings new" class="text-faded" />
        </q-btn>
  
      </q-toolbar>
      <div class="head-bottom row justify-left col-12">
        <div class="col-3">
          <p class="font-22 text-black">
            {{$t('VERSION_INFO')}}
          </p>
          <p>
            <i class="font-16 text-secondary"> Asch Wallet </i>
            <span class="font-16 text-six">V1.4.0</span>
          </p>
        </div>
        <div class="col-3">
          <p class="font-22 text-black">
            {{$t(' TIME')}}
          </p>
          <p>
            <span class="font-16 text-secondary">{{latestBlock.timestamp | time}}</span>
          </p>
        </div>
        <div class="col-3" v-if="latestBlock">
          <p class="font-22 text-black">
            {{$t(' LATEST_BLOCK_HEIGHT')}}
          </p>
          <i class="height-icon material-icons material-icons vertical-align-middle text-secondary font-22">equalizer</i>
          <i class="height-icon material-icons material-icons vertical-align-middle text-secondary font-22">equalizer</i>
          <i class="height-icon material-icons material-icons vertical-align-middle text-secondary font-22">equalizer</i>
          <i class="height-icon material-icons material-icons vertical-align-middle text-secondary font-22">equalizer</i>
          <i class="height-icon material-icons material-icons vertical-align-middle text-secondary font-22">equalizer</i>
        </div>
        <div class="col-3" v-if="latestBlock">
          <p class="font-60 text-secondary">{{latestBlock.height}}</p>
        </div>
      </div>
    </q-layout-header>
  
    <q-layout-drawer class="bg-seven" v-model="showLeft" side="left">
      <!--
                          Use <q-item> component
                          instead of <q-item> for
                          internal vue-router navigation
                        -->
      <q-list no-border link inset-delimiter>
        <q-list-header>
          <div class="menu-logo" /> </q-list-header>
        <q-item class="list-item-container" item :to="getRouterConf('home')">
          <q-item-side icon="home" />
          <q-item-main :label="$t('HOME')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('account')">
          <q-item-side icon="attach money" />
          <q-item-main :label="$t('ASSET')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('transfer')">
          <q-item-side icon="compare arrows" />
          <q-item-main :label="$t('TRANSFER')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('proposal')">
          <q-item-side icon="compare arrows" />
          <q-item-main :label="$t('PROPOSAL')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('council')">
          <q-item-side icon="compare arrows" />
          <q-item-main :label="$t('COUNCIL')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('gateway')">
          <q-item-side icon="apps" />
          <q-item-main :label="$t('GATEWAY')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('applications')">
          <q-item-side icon="apps" />
          <q-item-main :label="$t('APPLICATIONS')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('personal')">
          <q-item-side icon="person" />
          <q-item-main :label="$t('PERSONAL')" />
        </q-item>
        <!-- <q-item item :to="getRouterConf('forging')">
                <q-item-side icon="gavel" />
                <q-item-main :label="$t('FORGING')" />
              </q-item> -->
        <q-item class="list-item-container" item :to="getRouterConf('blocks')">
          <q-item-side icon="public" />
          <q-item-main :label="$t('BLOCKS')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('delegates')">
          <q-item-side icon="format list numbered" />
          <q-item-main :label="$t('VOTE')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('issuer')">
          <q-item-side icon="blur on" />
          <q-item-main :label="$t('TRS_TYPE_UIA_ISSUE')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('peers')">
          <q-item-side icon="blur on" />
          <q-item-main :label="$t('PEERS')" />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container class="all-page-container">
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="500">
        <router-view :userObj="user" />
      </transition>
  
      <!-- common component with event -->
      <account-info :show="accountShow" :account="accountInfo" @close="accountShow=false" />
  
      <q-modal content-classes="layout-padding" v-model="transShow" maximized no-backdrop-dismiss content-css="padding: 50px">
        <div class="col-8">
          <trans-panel :showTitle="true" :assets="assets" :asset="asset" :user="userInfo">
            <div slot="btns" slot-scope="props" class="row col-12 justify-between">
              <q-btn big class="col-auto" color="primary" @click="sendTrans(props.send)" :label="$t('SEND')" />
              <q-btn big class="col-auto" color="orange" @click="transShow=false;props.cancel()" :label="$t('label.close')" />
            </div>
          </trans-panel>
        </div>
      </q-modal>
  
      <code-modal :show="QRCodeShow" @close="QRCodeShow = false" :text="QRCodeText" />
      <!-- <float-menu v-if="this.showFloatBtns" :router="$router" :userObj="user" /> -->
      <trans-info-modal :show="transInfoModalShow" :row="trans" @close="transInfoModalShow=false" />
    </q-page-container>
    <q-ajax-bar ref="bar" position="top" color="orange" />
  </q-layout>
</template>

<script>
import { setCache, getCache, removeCache } from '../utils/util'
import FloatMenu from '../components/FloatMenu'
import TransPanel from '../components/TransPanel'
import AccountInfo from '../components/AccountInfo'
import CodeModal from '../components/QRCodeModal'
import TransInfoModal from '../components/TransInfoModal'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import {
  QLayout,
  QPageContainer,
  QPage,
  QLayoutHeader,
  QLayoutFooter,
  QLayoutDrawer,
  QModal,
  QBtn,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile,
  QToolbar,
  QToolbarTitle
} from 'quasar'

import logo from '../assets/logo.png'
const func = () => {}

export default {
  name: 'Home',
  components: {
    FloatMenu,
    TransPanel,
    AccountInfo,
    CodeModal,
    QLayout,
    QPageContainer,
    QPage,
    QLayoutHeader,
    QLayoutFooter,
    QLayoutDrawer,
    QModal,
    QBtn,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    QToolbar,
    QToolbarTitle,
    TransInfoModal
  },
  data() {
    return {
      user: null,
      showLeft: true,
      logo: logo,
      accountShow: false,
      accountInfo: {},
      asset: null,
      transShow: false,
      showFloatBtns: true,
      address: '',
      QRCodeShow: false,
      QRCodeText: '',
      intervalNum: -1,
      trans: null,
      transInfoModalShow: false
    }
  },
  methods: {
    ...mapActions(['refreshAccounts', 'getAccountsInfo', 'getBalances']),
    ...mapMutations([
      'updateUserInfo',
      'setUserInfo',
      'setVersion',
      'setLatestBlock',
      'setUserIsLogin',
      'setBalances'
    ]),
    logout() {
      removeCache('user')
      this.setUserIsLogin(false)
      this.$router.push('/login')
    },
    getRouterConf(name) {
      const conf = {
        name: name,
        params: {
          user: this.user
        }
      }
      return conf
    },
    async openTransactionDialog(asset = null) {
      if (asset) {
        // asset.symbol = asset.name
        this.asset = asset
      } else {
        this.asset = {
          currency: 'XAS',
          precision: 8,
          balance: this.userInfo.account.xas
        }
      }
      this.transShow = true
    },
    async openAccountModal(address) {
      let res = await this.getAccountsInfo({
        address: address
      })
      this.accountInfo = res.account
      this.accountShow = true
    },
    async getIssuer(cbOk = func, cbErr = func) {
      // get user issuer info
      let res = await this.issuer({
        address: this.user.account.address
      })
      if (res.success) {
        this.user.issuer = res.issuer
        let user = this._.merge({}, this.userInfo, res)
        this.user = user
        if (getCache('user')) setCache('user', user)
        cbOk(res)
        // TODO
      } else {
        cbErr()
      }
    },
    async getAssetsList(cbOk = func, cbErr = func) {
      // get user issuer info
      let res = await this.uiaAssetListApi({})
      if (res.success) {
        let user = this._.merge({}, this.userInfo, res)
        this.user = user
        if (getCache('user')) setCache('user', user)
        cbOk(res)
      } else {
        cbErr()
      }
    },

    async openTransInfoModal(trans) {
      // get user issuer info
      this.trans = trans
      this.transInfoModalShow = true
    },

    showAjaxBar() {
      let bar = this.$refs.bar
      bar.start()
      this._.delay(() => bar.stop(), 10000)
    },
    changeFloatBtn() {
      this.showFloatBtns = !this.showFloatBtns
    },
    showQRCodeModal(content) {
      this.QRCodeShow = true
      this.QRCodeText = content
    },
    async sendTrans(send) {
      let flag = await send()
      if (flag) {
        this.transShow = false
      }
    }
  },
  async mounted() {
    let user = this.userInfo || getCache('user') || null
    if (!user) {
      console.log('no session data, please login...')
      this.$router.push('/login')
    } else {
      let res = await this.getAccountsInfo({
        address: user.account.address
      })
      if (res.success) {
        let userInfo = this._.merge({}, user, res)
        this.setUserInfo(userInfo)
        this.setLatestBlock(res.latestBlock)
        this.setVersion(res.version)
        this.intervalNum = setInterval(() => this.refreshAccounts(), 10000)
        // window.CHPlugin.checkIn()
      }
    }
  },
  computed: {
    ...mapGetters(['latestBlock', 'version', 'userInfo', 'balances']),
    secondSignature() {
      return this.userInfo ? this.userInfo.account.secondPublicKey : null
    },
    assets() {
      if (this.userInfo) {
        let balances = this.balances
        let account = this.userInfo.account
        let XASAsset = {
          currency: 'XAS',
          precision: 8,
          balance: account.xas
        }
        // balances.unshift()
        let assets = [XASAsset].concat(balances)
        return assets
      } else {
        return []
      }
    }
  },
  created() {
    // register event
    this.$root.$on('getIssuer', () => {
      this.user && this.user.account ? this.getIssuer() : console.log('not init yet..')
    })
    this.$root.$on('showTransInfoModal', this.openTransInfoModal)
    this.$root.$on('openAccountModal', this.openAccountModal)
    this.$root.$on('openTransactionDialog', this.openTransactionDialog)
    this.$root.$on('showAjaxBar', this.showAjaxBar)
    this.$root.$on('changeFloatBtn', this.changeFloatBtn)
    this.$root.$on('showQRCodeModal', this.showQRCodeModal)
  },
  beforeDestroy() {
    clearInterval(this.intervalNum)
    this.$root.$off('getIssuer', this.getIssuer)
    this.$root.$off('openAccountModal', this.openAccountModal)
    this.$root.$off('openTransactionDialog', this.openTransactionDialog)
    this.$root.$off('showAjaxBar', this.showAjaxBar)
    this.$root.$off('changeFloatBtn', this.changeFloatBtn)
    this.$root.$off('showQRCodeModal', this.showQRCodeModal)
    this.$root.$off('showTransInfoModal', this.openTransInfoModal)
  }
}
</script>

<style lang="stylus">
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.menu-logo {
  background: url('../assets/logo.png') no-repeat;
  background-size: 100%;
  width: 260px;
  height: 77px;
}

.q-field {
  margin-top: 10px;
}

#ch-plugin-launcher {
  display: none;
}

.head-top {
  border-bottom: 2px solid #eaeceb;
}

.head-bottom {
  padding: 30px;
  background: #ffffff;
}

.height-icon {
  margin-right: -9px;
}

.all-page-container {
  background: #e7ebee;
}

.q-layout-drawer {
  background: #252d3a;
}

.list-item-container:hover i {
  color: #ffffff;
}

.list-item-container:hover {
  color: #ffffff;
}

.list-item-container {
  height: 70px;
  color: #5c636e;
  font-size: 18px;
  border-bottom: 1px solid #2c3411;
}

.q-item.active, .q-item.router-link-active, .q-item:focus {
  color: #ffffff;
}

.q-item.active i, .q-item.router-link-active i, .q-item:focus i {
  color: #ffffff;
}
</style>
