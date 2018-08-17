<template>
  <q-layout ref="layout" view="lHh Lpr lFf">
    <q-layout-header class="no-shadow">
  
      <q-toolbar class="head-mobile-top row justify-between bg-white">
        <div class="head-top-left">
          <q-btn flat @click="showLeft=!showLeft">
            <q-icon name="menu" class="text-faded" />
          </q-btn>
          <div class="mobile-hide head-top-left-container">
            <span class="font-18 text-black font-weight">
              {{$t(' LATEST_BLOCK_HEIGHT')}}
            </span>
            <i v-for='n in 3' :key=n class="height-icon material-icons vertical-align-middle text-secondary font-22">equalizer</i>
            <span class="font-30 text-secondary margin-left-10 font-weight vertical-align-sub">{{latestBlock.height}}</span>
          </div>
          <span class="mobile-hide head-top-left-line vertical-align-middle"></span>
          <div class="mobile-hide head-top-left-container  vertical-align-middle">
            <span class="font-18 text-black font-weight vertical-align-middle">
              {{$t(' TIME_LAST')}}
            </span>
            <span class="font-22 text-secondary font-weight vertical-align-middle">{{latestBlock.timestamp | time}}</span>
          </div>
        </div>

       <div class="desktop-hide text-black" >
         {{clientPathName}}
       </div>
  
        <q-btn flat @click="logout">
          <q-tooltip>
            {{$t('EXIT')}}
          </q-tooltip>
          <q-icon name="power settings new" class="text-faded" />
        </q-btn>
  
      </q-toolbar>
    </q-layout-header>
  
    <q-layout-drawer class="bg-seven main-left-list-container" v-model="showLeft" side="left">
      <q-list no-border link inset-delimiter>
        <q-list-header class="header-container row justify-left">
          <div class="header-left row justify-center items-center" @click="toHome">
            <span class="menu-logo"></span>
          </div>
          <div class="header-right margin-left-10" @click="toHome">
            <span class="header-right-top">{{$t('ASCH')}}</span>
            <span class="header-right-bottom font-12">Asch Client {{version.version}}-{{version.net}}</span>
          </div>
        </q-list-header>
        <q-item class="list-item-container" item :to="getRouterConf('home')">
          <q-item-side icon="home" />
          <q-item-main :label="$t('HOME')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('assets')">
          <q-item-side icon="attach money" />
          <q-item-main :label="$t('ASSET')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('transfer')">
          <q-item-side icon="compare arrows" />
          <q-item-main :label="$t('TRANSFER')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('proposal')">
          <q-item-side icon="gavel" />
          <q-item-main :label="$t('PROPOSAL')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('gateway')">
          <q-item-side icon="apps" />
          <q-item-main :label="$t('GATEWAY')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('councilDetail')">
            <q-item-side icon="group" />
            <q-item-main :label="$t('COUNCIL')" />
          </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('delegates')">
          <q-item-side icon="format list numbered" />
          <q-item-main :label="$t('VOTE')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('blocks')">
          <q-item-side icon="public" />
          <q-item-main :label="$t('BLOCKS')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('applications')">
          <q-item-side icon="apps" />
          <q-item-main :label="$t('APPLICATIONS')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('personal')">
          <q-item-side icon="person" />
          <q-item-main :label="$t('PERSONAL')" />
        </q-item>
        <q-item class="list-item-container" item :to="getRouterConf('issuer')">
          <q-item-side icon="send" />
          <q-item-main :label="$t('TRS_TYPE_UIA_ISSUE')" />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container class="all-page-container">
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="500">
        <router-view :userObj="user" />
      </transition>
  
      <!-- common component with event -->
      <account-info :show="accountShow" :account="accountInfo" @close="accountShow=false" />
  
      <q-modal class="transfer-modal-container" content-class="modal-content-limit" v-model="transShow" no-backdrop-dismiss>
        <div class="col-8">
          <trans-panel :showTitle="true" :assets="assets" :asset="asset" :user="userInfo">
            <div slot="btns" slot-scope="props" class="row col-12 justify-between">
              <q-btn big outline class="col-auto" color="secondary" @click="transShow=false;props.cancel()" :label="$t('label.close')" />
              <q-btn big class="col-auto" color="secondary" :disable="btnDisable" @click="sendTrans(props.send)" :label="$t('SEND')" />
            </div>
          </trans-panel>
        </div>
      </q-modal>
  
      <code-modal :show="QRCodeShow" @close="QRCodeShow = false" :text="QRCodeText" />
      <trans-info-modal class="code-modal-container" :show="transInfoModalShow" :row="trans" @close="transInfoModalShow=false" />
    </q-page-container>
  
    <q-ajax-bar ref="bar" position="top" color="orange" />
  
    <q-layout-footer class="no-shadow footer-container ">
      <div class="desktop-hide row justify-left height-28 footer-introduce">
        <span class="font-14 text-black font-weight height-36">
              {{$t(' LATEST_BLOCK_HEIGHT')}}
        </span>
        <i v-for="n in 3" :key=n class="material-icons text-secondary font-18 margin-right-minus-5 height-36">equalizer</i>
        <span class="text-secondary font-24 margin-left-10 font-weight height-36">{{latestBlock.height}}</span>
      </div>
      <div class="desktop-hide row justify-left height-28 footer-introduce">
        <span class="font-14 text-black font-weight vertical-align-middle">
              {{$t(' TIME_LAST')}}
          </span>
        <span class="font-18 text-secondary font-weight vertical-align-middle">{{latestBlock.timestamp | time}}</span>
      </div>
      <div class="row justify-between height-36">
        <span class="footer-introduce font-12">©2018 copyright</span>
        <span class="footer-introduce font-12">{{version.version}} {{version.net}} {{version.build}}</span>
      </div>
  
    </q-layout-footer>
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
  QToolbarTitle,
  QIcon,
  QListHeader,
  QAjaxBar,
  QTooltip
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
    TransInfoModal,
    QIcon,
    QListHeader,
    QAjaxBar,
    QTooltip
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
      transInfoModalShow: false,
      btnDisable: false
    }
  },
  methods: {
    ...mapActions([
      'refreshAccounts',
      'getAccountsInfo',
      'getBalances',
      'getIssuer',
      'registGateway'
    ]),
    ...mapMutations([
      'updateUserInfo',
      'setUserInfo',
      'setVersion',
      'setLatestBlock',
      'setUserIsLogin',
      'setBalances'
    ]),
    toHome() {
      this.$router.push('home')
    },
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
        this.asset = this._.merge({}, asset)
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
      } else {
        this.disableBtn('btnDisable')
      }
    },
    disableBtn(model) {
      this[model] = true
      this._.delay(() => {
        this[model] = false
      }, 3000)
    }
    // showAssetDetailModal(asset){
    // }
  },
  beforeMount() {
    let lang = (this.$i18n.locale = getCache('locale'))
    console.log(lang)
    import(`src/i18n/${lang}`).then(lang => {
      this.$q.i18n.set(lang.default)
    })
    if (window && window.location && process.env.NODE_ENV === 'production') {
      const location = window.location
      let server = location.protocol + '//' + location.hostname + ':' + location.port || 80
      setCache('currentServer', server)
    }
  },
  async mounted() {
    let user = this.userInfo || getCache('user') || null
    if (!user) {
      this.$router.push('/login')
    } else {
      let res = await this.getAccountsInfo({
        address: user.account.address
      })
      if (res.success) {
        let userInfo = this._.merge({}, user, res)
        userInfo.address = user.account.address
        if (!userInfo.account) {
          userInfo.account = {
            address: user.account.address,
            xas: 0,
            isLocked: 0,
            isAgent: 0,
            lockHeight: 0,
            agent: 0,
            isDelegate: 0,
            weight: 0,
            agentWeight: 0
          }
        }
        this.setUserInfo(userInfo)
        this.setLatestBlock(res.latestBlock)
        this.setVersion(res.version)
        this.intervalNum = setInterval(() => this.refreshAccounts(), 10000)
      }
      this.getIssuer()
      // if (res.success && res.issuer) {
      //   let user = this.userInfo
      //   user = this._.merge({}, user, { issuer: res.issuer })
      //   this.setUserInfo(user)
      // }
    }
    // this.registGateway({})
  },
  computed: {
    ...mapGetters(['latestBlock', 'version', 'userInfo', 'balances']),
    secondSignature() {
      return this.userInfo ? this.userInfo.account.secondPublicKey : null
    },
    clientPathName() {
      let pathObj = {
        home: 'HOME',
        assets: 'ASSET',
        assetDetail: 'ASSET',
        transfer: 'TRANSFER',
        proposal: 'PROPOSAL',
        launchProposal: 'PROPOSAL',
        proposalDetail: 'PROPOSAL',
        gateway: 'GATEWAY',
        gatewayDetail: 'GATEWAY',
        delegates: 'TRS_TYPE_VOTE',
        blocks: 'BLOCKS',
        applications: 'APPLICATIONS',
        personal: 'PERSONAL',
        issuer: 'TRS_TYPE_UIA_ISSUE'
      }
      for (var key in pathObj) {
        if (this.$route.name === key) {
          return this.$t(pathObj[key])
        }
      }
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
    this.$root.$on('showTransInfoModal', this.openTransInfoModal)
    this.$root.$on('openAccountModal', this.openAccountModal)
    this.$root.$on('openTransactionDialog', this.openTransactionDialog)
    this.$root.$on('showAjaxBar', this.showAjaxBar)
    this.$root.$on('showQRCodeModal', this.showQRCodeModal)
    // this.$root.$on('showAssetDetailModal', this.showAssetDetailModal)
  },
  beforeDestroy() {
    clearInterval(this.intervalNum)
    this.$root.$off('openAccountModal', this.openAccountModal)
    this.$root.$off('openTransactionDialog', this.openTransactionDialog)
    this.$root.$off('showAjaxBar', this.showAjaxBar)
    this.$root.$off('showQRCodeModal', this.showQRCodeModal)
    this.$root.$off('showTransInfoModal', this.openTransInfoModal)
    // this.$root.$off('showAssetDetailModal', this.showAssetDetailModal)
  }
}
</script>

<style lang="stylus">
body {
  background: #e7ebee;
}

.main-left-list-container {
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.q-list-header {
  padding-left: 40px !important;
  cursor: pointer;
}

.header-container {
  padding-bottom: 16px;
}

.header-left {
  width: 70px;
  height: 70px;
  background: #3e4654;
  border-radius: 10px;
}

.header-right {
  padding-top: 15px;
  line-height: 20px;
}

.menu-logo {
  display: block;
  background: url('../assets/logo1.png') no-repeat;
  background-size: 100%;
  width: 40px;
  height: 40px;
}

.header-right-top {
  display: block;
  font-size: 23px;
  color: #bdc2cb;
  margin-bottom: 5px;
}

.header-right-bottom {
  margin-top: 10px;
  color: #bdc2cb;
}

.q-field {
  margin-top: 10px;
}

#ch-plugin-launcher {
  display: none;
}

.head-top {
  height: 80px;
  border-bottom: 2px solid #eaeceb;
}

.head-mobile-top {
  height: 40px;
}

.head-bottom {
  padding: 30px;
  background: #ffffff;
}

.height-icon {
  margin-right: -5px;
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
  border-left: 4px solid #ff750b;
  background: #252d3a !important;
}

.list-item-container {
  height: 70px;
  color: #8b939e;
  font-size: 18px;
  padding-left: 40px;
  border-bottom: 1px solid #2c3411;
  border-left: 4px solid transparent;
}

.q-item.active, .q-item.router-link-active, .q-item:focus {
  color: #ffffff;
  border-left: 4px solid #ff750b;
  background: #252d3a;
}

.q-item.active i, .q-item.router-link-active i, .q-item:focus i {
  color: #ffffff;
}

.head-bottom-item-container {
  margin-right: 80px;
}

.head-bottom-item-latestBlock {
  margin-right: 30px;
}

.head-top-left-container {
  display: inline-block;
  vertical-align: middle;
}

.head-top-left-line {
  width: 1px;
  height: 20px;
  display: inline-block;
  background: #dddddd;
  margin: 0 30px;
}

.footer-container {
  background: #f0f3f6;
}

.footer-introduce {
  padding: 0 10px;
  color: #999999;
}

.height-28 {
  height: 28px;
  line-height: 36px;
}

.transfer-modal-container {
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
