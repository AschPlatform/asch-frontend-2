<template>
  <q-page class="tab-panel-container row ">
    <q-card class="col-12">
      <q-card-title>
        {{$t('DAPP_LIST')}}
        <q-toggle v-model="installed" :label="$t('DAPP_INSTALL_LIST')" color="secondary" />
        <div slot="right" class="row items-center">
          <q-btn flat color="primary" :label="$t('CREATE_MY_DAPP')" @click="createMyDapp" /> 
        </div>
      </q-card-title>
      <q-card-main class="row">
        <!-- <q-card inline class="col-3" v-for="(dapp,idx) in dapps" :key="idx">
          <q-card-media>
            <img :src="dapps.icon">
          </q-card-media>
          <q-card-title>
            {{dapp.name}}
          </q-card-title>
          <q-card-main>
            {{ dapp.description }}
          </q-card-main>
          <q-card-actions>
            <q-btn :label="$t('BALANCE')" flat @click="balance(dapp)" />
            <q-btn :label="$t('DEPOSIT')" flat @click="deposit(dapp)"/>
            <q-btn :label="$t('CHECK')" flat @click="check(dapp)"/>
          </q-card-actions>
        </q-card> -->
        <q-card inline color="white" text-color="black" v-for="(dapp,idx) in dapps" class="col-3 assets-panel-content" :key="idx">
          <q-card-media>
            <img :src="dapp.icon" />
          </q-card-media>
          <q-card-title>
            {{dapp.name}}
            <div slot="center" class="row items-center">
              <q-icon name="place" /> 250 ft
            </div>
          </q-card-title>
          <q-card-main>
            <p>$・Italian, Cafe</p>
            <p class="text-faded">{{dapp.desc}}</p>
          </q-card-main>
          <q-card-separator />
          <q-card-actions>
            <q-btn :label="$t('BALANCE')" flat @click="balance(dapp)" />
            <q-btn :label="$t('DEPOSIT')" flat @click="deposit(dapp)" />
            <q-btn :label="$t('CHECK')" flat @click="check(dapp)" />
          </q-card-actions>
        </q-card>
        <q-btn v-if="dapps.length < pagination.rowsNumber" :label="$t('LOAD_MORE')" @click="loadMore" />
      </q-card-main>
    </q-card>

    <q-modal minimized no-backdrop-dismiss  v-model="modalInfoShow" content-css="padding: 20px">
      <big>{{$t('DAPP_DETAIL')}}</big>
        <table class="q-table horizontal-separator highlight loose ">
          <thead>
            <tr v-if="balanceType==0">
              <th>{{$t('DAPP_SUPPORT_COIN')}}</th>
              <th>{{$t('DAPP_COIN_CURRENT_QUANTITY')}}</th>
              <th>{{'DAPP'+$t('BALANCE')}}</th>
            </tr>
            <tr v-if="balanceType==1">
              <th>{{$t('DAPP_SUPPORT_COIN')}}</th>
              <th>{{'DAPP'+$t('BALANCE')}}</th>
            </tr>
          </thead>
          <tbody v-if="balanceType==0" class='info-tbody'>
            <tr v-for="b in dappBalances" :key="b.currency" >
              <td >{{b.currency}}</td>
              <td >
                {{b.quantityShow | unit($t)}} 
                
              </td>
              <td >{{b.balanceShow}}</td>
            </tr>
          </tbody>
          <tbody v-if="balanceType==1" class='info-tbody'>
            <tr v-for="b in dappBalances" :key="b.currency" >
              <td >{{b.currency}}</td>
              <td >{{b.balance | fee}}</td>
            </tr>
          </tbody>
          
        </table>
      <br/>
      <q-btn
        color="primary"
        @click="()=>{
          this.modalInfoShow = false
          this.dappBalances = {}
          }"
        :label="$t('label.close')"
      />
    </q-modal>

    <q-dialog
      v-model="dialogShow"
      prevent-close
      @ok="onOk"
      @cancel="onCancel"
    >
      <!-- This or use "title" prop on <q-dialog> -->
      <span slot="title">{{dialog.title}}</span>
      <span slot="message">{{dialog.message}}</span>

      <div class="row" slot="body">
        <q-field 
          class="col-12"
          :label-width="4">
          <q-select :float-label="$t('ASSET')" filter v-model="form.depositName" 
          :options="assetsOpt"  :error="$v.form.depositName.$error" error-label="error" />
        </q-field>
        <q-field 
            :label-width="4"
            class="col-12"
          >
            <q-input :float-label="$t('AMOUNTS')"  @blur="$v.form.amount.$touch" 
            v-model="form.amount" type="number" :decimals="0" :error="$v.form.amount.$error" error-label="error" />
        </q-field>
        <q-field 
            v-if="dialog.form==3"
            :label-width="4"
            class="col-12"
          >
            <q-input :float-label="$t('ADDRESS')"  @blur="validateAddr" 
            v-model="form.address" :error="this.addressError" :error-label="$t('ERR_TOAST_ACCOUNT_INVALID_RECIPIENT')" />
        </q-field>
        <q-field v-if="secondSignature"
          class="col-12"
          :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"
          :error="secondPwdError"
          :label-width="2"
        >
          <q-input :float-label="$t('SECOND_PASSWORD')" v-model="form.secondPwd" type="password" @blur="validateSecondPwd" />
        </q-field>
      </div>
      <template slot="buttons" slot-scope="props">
        <q-btn flat color="primary" :label="$t('label.cancel')" @click="props.cancel" />
        <q-btn flat color="primary" :label="$t('label.ok')" @click="props.ok" />
      </template>
    </q-dialog>
    </q-page>
</template>

<script>
import { toast, toastWarn, translateErrMsg } from '../utils/util'
import { createInTransfer, createInnerTransaction, check58 } from '../utils/asch'
import { required, minValue, numeric } from 'vuelidate/lib/validators'
import { secondPwdReg } from '../utils/validators'
import { mapActions, mapGetters } from 'vuex'

import defaultIcon from '../assets/dapps.png'
import {
  QPage,
  QModal,
  QDialog,
  QField,
  QInput,
  QBtn,
  QToggle,
  QCard,
  QCardMain,
  QCardTitle,
  QCardActions,
  QCardMedia,
  QCardSeparator,
  openURL,
  QSelect
} from 'quasar'
export default {
  props: ['userObj'],
  components: {
    QPage,
    QModal,
    QDialog,
    QField,
    QInput,
    QBtn,
    QToggle,
    QCard,
    QCardMain,
    QCardTitle,
    QCardActions,
    QCardMedia,
    QCardSeparator,
    QSelect
  },
  data() {
    return {
      dapps: [
        {
          tid: '4f322b6932870e710254c92a77fd892e81462aabd347ea3f0108173c5538d620',
          name: 'test',
          desc: 'test chain',
          link: 'https://github.com/testchain.zip',
          icon: 'http://wx1.sinaimg.cn/mw690/0060lm7Tly1fqq2zj8686j307k03raa5.jpeg',
          unlockNumber: 3,
          t_timestamp: 57400250,
          t_type: 200,
          t_height: 30
        },
        {
          tid: '4f322b6932870e710254c92a77fd892e81462aabd347ea3f0108173c5538d620',
          name: 'Moxi',
          desc: 'test chain',
          link: 'https://github.com/testchain.zip',
          icon: 'http://wx1.sinaimg.cn/mw690/0060lm7Tly1fqq2zj8686j307k03raa5.jpeg',
          unlockNumber: 3,
          t_timestamp: 57400250,
          t_type: 200,
          t_height: 30
        },
        {
          tid: '4f322b6932870e710254c92a77fd892e81462aabd347ea3f0108173c5538d620',
          name: 'Presh',
          desc: 'test chain',
          link: 'https://github.com/testchain.zip',
          icon: 'http://wx1.sinaimg.cn/mw690/0060lm7Tly1fqq2zj8686j307k03raa5.jpeg',
          unlockNumber: 3,
          t_timestamp: 57400250,
          t_type: 200,
          t_height: 30
        },
        {
          tid: '4f322b6932870e710254c92a77fd892e81462aabd347ea3f0108173c5538d620',
          name: 'Dophi',
          desc: 'test chain',
          link: 'https://github.com/testchain.zip',
          icon: 'http://wx1.sinaimg.cn/mw690/0060lm7Tly1fqq2zj8686j307k03raa5.jpeg',
          unlockNumber: 3,
          t_timestamp: 57400250,
          t_type: 200,
          t_height: 30
        },
        {
          tid: '4f322b6932870e710254c92a77fd892e81462aabd347ea3f0108173c5538d620',
          name: 'test2',
          desc: 'test chain2',
          link: 'https://github.com/testchain.zip',
          icon: 'http://wx1.sinaimg.cn/mw690/0060lm7Tly1fqq2zj8686j307k03raa5.jpeg',
          unlockNumber: 3,
          t_timestamp: 57400250,
          t_type: 200,
          t_height: 30
        }
      ],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      filter: '',
      loading: false,
      modalInfoShow: false,
      row: {},

      dialogShow: false,
      dialog: {
        title: '',
        message: '',
        form: 1 // 1 deposit; 2 withDraw
      },
      dappBalances: [],
      balanceType: 0, // 0 dapp, 1 user
      form: {
        depositName: '',
        amount: null,
        address: null,
        secondPwd: ''
      },
      addressError: false,
      secondPwdError: false,
      installed: false,
      defaultIcon: defaultIcon
    }
  },
  validations: {
    form: {
      amount: {
        required,
        numeric,
        minValue: minValue(1)
      },
      depositName: {
        required
      }
    }
  },
  methods: {
    ...mapActions([
      'appBalance',
      'dappMyBalance',
      'broadcastTransaction',
      'appInstalled',
      'getAllChains',
      'dappContract'
    ]),
    async loadMore() {
      this.pagination.page += 1
      await this.getDapps()
    },
    async getDapps(pagination = {}, filter = '') {
      this.loading = true
      if (pagination && pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = {}
      if (this.installed) {
        res = await this.getAllChains({
          limit: limit,
          offset: (pageNo - 1) * limit
        })
      } else {
        res = await this.getAllChains({
          limit: limit,
          offset: (pageNo - 1) * limit
        })
      }
      if (pageNo === 1) {
        this.dapps = res.dapps
      } else {
        this.dapps = this.dapps.concat(res.dapps)
      }
      // set max
      this.pagination.rowsNumber = res.count && res.count.count ? res.count.count : 0
      this.loading = false
      return res
    },
    async viewAppBanlance(row) {
      await this.getBalance(row)
      this.modalInfoShow = true
    },
    async viewMyBanlance(row) {
      await this.getBalance(row, true)
      this.modalInfoShow = true
    },
    async getBalance(row, userFlag = false) {
      let res
      if (!userFlag) {
        res = await this.appBalance({
          appId: row.transactionId
        })
        this.balanceType = 0
      } else {
        res = await this.dappMyBalance({
          appid: row.transactionId,
          address: this.user.account.address
        })
        this.balanceType = 1
      }
      if (res.success === true) {
        let balences = res.balances.map(b => {
          // init XAS data
          if (b.currency === 'XAS') b.quantityShow = 100000000
          return b
        })
        this.dappBalances = balences
        return balences
      } else {
        translateErrMsg(this.$t, res.error)
        return []
      }
    },
    balance(dapp) {
      if (this.installed) {
        this.viewMyBanlance(dapp)
      } else {
        this.viewAppBanlance(dapp)
      }
    },
    check(dapp) {
      openURL(dapp.link)
    },
    async innerTrans(row) {
      await this.getBalance(row)
      const t = this.$t
      this.form.depositName = name
      this.modalInfoShow = false
      this.dialog = {
        title: t('TRS_TYPE_TRANSFER'),
        message: t('OPERATION_REQUIRES_FEE') + '0.1 XAS',
        form: 3
      }
      this.row = row
      this.dialogShow = true
    },
    async withDraw(row) {
      await this.getBalance(row)
      const t = this.$t
      this.form.depositName = name
      this.modalInfoShow = false
      this.dialog = {
        title: t('TRS_TYPE_WITHDRAWAL'),
        message: t('OPERATION_REQUIRES_FEE') + '0.1 XAS',
        form: 2
      }
      this.row = row
      this.dialogShow = true
    },
    deposit(dapp) {
      const t = this.$t
      this.dialog = {
        title: t('DAPP_DEPOSIT'),
        message: t('DAPP_COIN_FEE'),
        form: 1
      }
      this.row = dapp
      this.dialogShow = true
    },
    async onOk() {
      this.$v.form.$touch()
      if (this.$v.form.$error || (this.secondSignature && this.secondPwdError)) {
        toastWarn('error')
        this.dialogShow = true
        return
      }
      const { transactionId } = this.row
      const assets = this.selectedAssets
      const form = this.dialog.form
      let amount = parseFloat((this.form.amount * Math.pow(10, assets.precision)).toFixed(0))
      let res, trans

      if (form === 1) {
        trans = createInTransfer(
          transactionId,
          this.form.depositName,
          amount,
          this.user.secret,
          this.form.secondPwd
        )
        res = await this.broadcastTransaction(trans)
      } else if (form === 2) {
        let type = 2 // 这里的type指的是合约标号，而非主链的交易类型
        let options = {
          fee: '10000000',
          type: type,
          args: `["${this.form.depositName}", "${amount}"]`
        }
        trans = createInnerTransaction(options, this.user.secret)
        res = await this.dappContract(trans, this.row.transactionId)
      } else if (form === 3) {
        if (this.addressError) {
          toastWarn(this.$t('ERR_RECIPIENT_ADDRESS_FORMAT'))
          return
        }
        let type = 3 // 这里的type指的是合约标号，而非主链的交易类型
        let options = {
          fee: '10000000',
          type: type,
          args: `["${this.form.depositName}", "${amount}","${this.form.address}"]`
        }
        trans = createInnerTransaction(options, this.user.secret)
        res = await this.dappContract(trans, this.row.transactionId)
      }

      if (res.success === true) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
      } else {
        translateErrMsg(this.$t, res.error)
      }
      this.resetFrom()
    },
    onCancel() {
      this.dialogShow = false
      this.dialog = this.dialogDefault
    },
    close() {
      this.dialogShow = false
      this.row = {}
    },
    validateSecondPwd(val) {
      let isValid = this.pwdValid
      this.secondPwdError = isValid
      return isValid
    },
    resetFrom() {
      this.form = {
        depositName: '',
        amount: null
      }
      this.$v.$reset()
    },
    validateAddr() {
      let validated = check58(this.form.address)
      this.addressError = !validated
      return validated
    },
    noError(props) {
      props.value = defaultIcon
    },
    createMyDapp() {
      openURL('https://github.com/AschPlatform/asch/tree/master/docs/dapp_docs')
    }
  },
  async mounted() {
    if (this.user) {
      this.getDapps()
      // this.$root.$emit('getAssetsList')
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'balances']),
    user() {
      return this.userInfo
    },
    secondSignature() {
      return this.user && this.user.account ? this.user.account.secondPublicKey : null
    },
    pwdValid() {
      return !secondPwdReg.test(this.form.secondPwd)
    },
    assets() {
      return this.user.assets
    },
    dialogDefault() {
      return {
        title: '',
        message: ''
      }
    },
    paginationDeafult() {
      return {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      }
    },
    selectedAssets() {
      let depositName = this.form.depositName
      if (depositName === 'XAS') {
        return {
          precision: 10,
          name: depositName
        }
      } else {
        let obj = null
        this.user.assets.forEach(a => {
          if (a.name === depositName) obj = a
        })
        return obj
      }
    },
    assetsOpt() {
      if (this.user && this.user.assets) {
        let assets = []
        const formType = this.dialog.form
        if (formType === 1) {
          assets = [
            {
              key: 0,
              value: 'XAS',
              label: 'XAS'
            }
          ].concat(
            this.user.assets.map((item, idx) => {
              return {
                key: idx + 1,
                label: item.name,
                value: item.name
              }
            })
          )
        } else {
          assets = this.dappBalances.map((item, idx) => {
            return {
              key: idx + 1,
              label: item.currency,
              value: item.currency
            }
          })
        }

        return assets
      } else {
        return []
      }
    }
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.getDapps()
        // if (!val.assets) this.$root.$emit('getAssetsList')
      }
    },
    pageNo(val) {
      this.getDapps()
    },
    installed(val) {
      this.dapps = []
      this.pagination = this.paginationDeafult
      this.getDapps(null, null, true)
    }
  }
}
</script>

<style lang="stylus" scoped>
.assets-panel-content {
  margin: 15px 30px;
  background: #ffffff;
  cursor: pointer;
  min-width: 300px;
}
</style>
