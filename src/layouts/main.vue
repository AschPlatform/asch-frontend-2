<template>
  <q-layout ref="layout" view="lHh Lpr fff">
    <q-layout-header>
  
      <q-toolbar>
        <q-btn flat @click="showLeft=!showLeft">
          <q-icon name="menu" />
        </q-btn>
  
        <q-toolbar-title>
          Asch
          <div slot="subtitle"></div>
        </q-toolbar-title>
        <q-btn flat @click="logout">
          <q-icon name="power settings new" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>
  
  
    <q-layout-drawer v-model="showLeft" side="left">
      <!--
                    Use <q-item> component
                    instead of <q-item> for
                    internal vue-router navigation
                  -->
      <q-list no-border link inset-delimiter>
        <q-list-header> <img :src="logo" /> </q-list-header>
        <q-item item :to="getRouterConf('home')">
          <q-item-side icon="home" />
          <q-item-main :label="$t('HOME')" />
        </q-item>
        <q-item item :to="getRouterConf('account')">
          <q-item-side icon="attach money" />
          <q-item-main :label="$t('ASSET')" />
        </q-item>
        <q-item item :to="getRouterConf('personal')">
          <q-item-side icon="person" />
          <q-item-main :label="$t('PERSONAL')" />
        </q-item>
        <q-item item :to="getRouterConf('applications')">
          <q-item-side icon="apps" />
          <q-item-main :label="$t('APPLICATIONS')" />
        </q-item>
        <q-item item :to="getRouterConf('forging')">
          <q-item-side icon="gavel" />
          <q-item-main :label="$t('FORGING')" />
        </q-item>
        <q-item item :to="getRouterConf('blocks')">
          <q-item-side icon="public" />
          <q-item-main :label="$t('BLOCKS')" />
        </q-item>
        <q-item item :to="getRouterConf('delegates')">
          <q-item-side icon="format list numbered" />
          <q-item-main :label="$t('VOTE')" />
        </q-item>
        <q-item item :to="getRouterConf('transfer')">
          <q-item-side icon="compare arrows" @click="$root.$emit('openTransactionDialog')"/>
          <q-item-main @click="$root.$emit('openTransactionDialog')" :label="$t('TRANSFER')" />
        </q-item>
        <q-item item :to="getRouterConf('peers')">
          <q-item-side icon="blur on" />
          <q-item-main :label="$t('PEERS')" />
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="500">
        <router-view :userObj="user" />
      </transition>

      <!-- common component with event -->
      <q-modal minimized no-backdrop-dismiss v-model="accountShow" content-css="padding: 20px">
        <big>{{$t('DAPP_DETAIL')}}</big>
        <table class="q-table horizontal-separator highlight loose ">
          <tbody class='info-tbody'>
            <tr disable v-clipboard="accountInfo.address" @success="info('copy address success...')">
              <td>{{$t('ADDRESS')}}</td>
              <td>{{accountInfo.address}}</td>
            </tr>
            <tr v-clipboard="accountInfo.publicKey" @success="info('copy publicKey success...')">
              <td>{{$t('PUBLIC_KEY')}}</td>
              <td>{{accountInfo.publicKey}}</td>
            </tr>
            <tr id='detail-amount' v-clipboard="accountInfo.balance" @success="info('copy balance success...')">
              <td>{{$t('BALANCE')}}</td>
              <td>{{accountInfo.balance | fee}}</td>
            </tr>
          </tbody>
        </table>
        <br/>
        <q-btn color="primary" @click="()=>{
              this.accountShow = false
              this.row = {}
              }" :label="$t('label.close')" />
      </q-modal>
  
      <q-modal v-model="transShow" minimized no-backdrop-dismiss content-css="padding: 20px" >
        <!-- This or use "title" prop on <q-dialog> -->
        <big >{{$t('TRS_TYPE_TRANSFER')}}</big><br/>
        <span>{{$t('PAY_TIP')}}</span>
  
        <div v-if="user && user.account" class=" col-8 " >
          <!-- <q-field class="col-12">
            <q-input disable :float-label="$t('SENDER')" v-model="user.account.address" />
          </q-field> -->
          <q-field class="col-12">
            <q-input v-if="form.currency" disable :float-label="$t('DAPP_CATEGORY')" v-model="form.currency" />
          </q-field>
          <q-field class="col-12">
            <q-input :float-label="$t('RECIPIENT')" @blur="$v.form.receiver.$touch" 
            v-model="form.receiver" :error="$v.form.receiver.$error" :error-label="$t('ERR_RECIPIENT_ADDRESS_FORMAT')" />
          </q-field>
          <q-field class="col-12">
            <q-input :float-label="$t('AMOUNTS')" @blur="$v.form.amount.$touch" 
            v-model="form.amount" type="number" :decimals="0" :error="$v.form.amount.$error" :error-label="$t('ERR_AMOUNT_INVALID')" />
          </q-field>
  
          <q-field v-if="secondSignature" class="col-12">
            <q-input :float-label="$t('SECOND_PASSWORD')" v-model="secondPwd" type="password" 
            @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
          </q-field>
          <q-field class="col-12">
            <q-input disable :float-label="$t('FEES')" v-model="form.fee" />
          </q-field>
          <q-field class="col-12">
            <q-input :float-label="$t('REMARK')" :helper="$t('REMARK_TIP')+'0 ~ 255'"
             @blur="$v.form.remark.$touch" v-model="form.remark" :error="$v.form.remark.$error" 
             :error-label="$t('ERR_INVALID_REMARK')" />
          </q-field>
        </div>
        <br/>
        <div class="row col-12 justify-between">
          <q-btn big class="col-auto"  color="primary" @click="send" :label="$t('SEND')" />
          <q-btn big class="col-auto"  color="orange" @click="cancel" :label="$t('label.close')" />
        </div>
    </q-modal>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
          icon="format list bulleted"
          direction="up"
          color="primary"
        >
          <q-fab-action @click="openTransactionDialog" color="blue" class="white" icon="compare arrows" />
          <q-fab-action @click="$router.push({name:'account'})" color="blue" class="white" icon="attach money" />
          <q-fab-action @click="$router.push({name:'home'})" color="blue" class="white" icon="home" />
        </q-fab>
      </q-page-sticky>
    </q-page-container>
       
  </q-layout>
</template>

<script>
import { api, translateErrMsg } from '../utils/api'
import { createTransaction, createTransfer } from '../utils/asch'
import { setCache, getCache, removeCache, toast, toastWarn } from '../utils/util'
import { address, secondPwd } from '../utils/validators'
import { required, maxLength, numeric, minValue } from 'vuelidate/lib/validators'
import { QPageSticky } from 'quasar'

import logo from '../assets/icon.png'
const func = () => {}

export default {
  name: 'Home',
  components: { QPageSticky },
  validations: {
    form: {
      amount: {
        required,
        numeric,
        minValue: minValue(1)
      },
      receiver: {
        required,
        address: address()
      },
      remark: {
        maxLength: maxLength(255)
      }
    },
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  data() {
    return {
      user: null,
      showLeft: true,
      logo: logo,
      accountShow: false,
      accountInfo: {},
      form: {
        from: '',
        currency: '',
        receiver: '',
        amount: '',
        fee: '0.1',
        remark: '',
        precision: 8
      },
      secondPwd: '',
      transShow: false
    }
  },
  methods: {
    logout() {
      removeCache('user')
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
    async openTransactionDialog(assets = null, cbOk = func, cbErr = func) {
      if (assets) {
        this.form.currency = assets.currency
        this.form.precision = assets.precision
      }
      this.transShow = true
    },
    async send() {
      this.$v.form.$touch()
      let invlaidPwd = false
      if (this.secondSignature) {
        this.$v.secondPwd.$touch()
        invlaidPwd = this.$v.secondPwd.$error
      }
      if (invlaidPwd || this.$v.form.$error) {
        this.transShow = true
        return
      }
      if (this.form.receiver === this.user.account.address) {
        toastWarn($t('ERR_RECIPIENT_EQUAL_SENDER'))
        return
      }
      let trans
      let { currency, amount, receiver, remark, precision } = this.form
      amount = (amount * Math.pow(10, precision)).toFixed(0)
      receiver = String(receiver)
      if (currency) {
        trans = createTransfer(currency, amount, receiver, remark, this.user.secret, this.secondPwd)
      } else {
        trans = createTransaction(receiver, amount, remark, this.user.secret, this.secondPwd)
      }
      let res = api.broadcastTransaction(trans)
      if (res.success === true) {
        toast(this.$t('INF_TRANSFER_SUCCESS'))
        this.resetForm()
      } else {
        translateErrMsg(this.$t, res.error)
        this.transShow = false
      }
    },
    cancel() {
      this.resetForm()
    },
    async openAccountModal(account, cbOk = func, cbErr = func) {
      let { address } = account
      let res = await api.account({
        address: address
      })
      this.accountInfo = res.account
      this.accountShow = true
    },
    async refreshAccount(cb = func) {
      // refresh user balance
      console.log('event refreshAccount...')
      let res = await api.account({
        address: this.user.account.address
      })
      let user = this._.merge({}, this.user, res)
      this.user = user
      setCache('user', user)
      this._.delay(() => cb(), 1500) // delay refresh
    },
    async getIssuer(cbOk = func, cbErr = func) {
      // get user issuer info
      let res = await api.issuer({
        address: this.user.account.address
      })
      if (res.success) {
        this.user.issuer = res.issuer
        let user = this._.merge({}, this.user, res)
        this.user = user
        setCache('user', user)
        cbOk(res)
        // TODO
      } else {
        cbErr()
      }
    },
    async getAssetsList(cbOk = func, cbErr = func) {
      // get user issuer info
      let res = await api.uiaAssetListApi({})
      if (res.success) {
        let user = this._.merge({}, this.user, res)
        this.user = user
        setCache('user', user)
        cbOk(res)
      } else {
        cbErr()
      }
    },
    resetForm() {
      this.transShow = false
      this.form = {
        currency: 'XAS',
        receiver: '',
        amount: '',
        secondPwd: '',
        fee: '0.1',
        remark: ''
      }
      this.$v.form.$reset()
      this.$v.secondPwd.$reset()
    }
  },
  async mounted() {
    let user = this.$route.params.user || getCache('user') || null
    if (!user) {
      console.log('no session data, please login...')
      this.$router.push('/login')
    } else {
      let res = await api.login({
        publicKey: user.account.publicKey
      })
      this.user = {
        ...user,
        ...res
      }
      // console.log(user)
    }
  },
  computed: {
    secondSignature() {
      return this.user ? this.user.account.secondSignature : null
    }
  },
  created() {
    // register event
    this.$root.$on('refreshAccount', this.refreshAccount)
    this.$root.$on('getAssetsList', this.getAssetsList)
    this.$root.$on('getIssuer', () => {
      this.user && this.user.account ? this.getIssuer() : console.log('not init yet..')
    })
    this.$root.$on('openAccountModal', this.openAccountModal)
    this.$root.$on('openTransactionDialog', this.openTransactionDialog)
  },
  beforeDestroy() {
    this.$root.$off('refreshAccount', this.refreshAccount)
    this.$root.$off('refreshAccount', this.getAssetsList)
    this.$root.$off('getIssuer', this.getIssuer)
    this.$root.$off('openAccountModal', this.openAccountModal)
  }
}
</script>

<style lang="stylus">
.logo-container {
  width: 255px;
  height: 242px;
  perspective: 800px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.logo {
  position: absolute;
  transform-style: preserve-3d;
}

.q-field {
  margin-top: 10px;
}

.card-table-container {
  overflow-x: scroll;
}
</style>
