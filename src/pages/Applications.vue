<template>
  <q-page class="tab-panel-container row">
    <q-card class="col-12 shadow-0">
      <div class="geteway-top justify-between">
        <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
        <span class="font-20 text-black vertical-align-middle">{{$t('APPLICATIONS')}}</span>
        <div slot="right" class="float-right row items-center inline">
          <q-btn color="secondary" form-inverted class="inverted" :label="$t('CREATE_MY_DAPP')" @click="createMyDapp" />
        </div>
      </div>
      <q-card-title>
        {{$t('DAPP_LIST')}}
        <q-toggle v-model="installed" :label="$t('DAPP_INSTALL_LIST')" color="secondary" />
      </q-card-title>
      <q-card-main class="row">
        <div class="row">
          <q-card inline color="white" text-color="black" v-for="(dapp,idx) in dapps" class="col-lg-3 col-md-10 col-xs-12 assets-panel-content" :key="idx">
            <q-card-media>
              <img :ref="'img'+idx" :src="dapp.icon"  @error="onError(idx)" />
            </q-card-media>
            <q-card-title align="center">
              {{dapp.name}}
              <div slot="center" class="row items-center">
              </div>
            </q-card-title>
            <q-card-main>
              <p class="text-faded">{{dapp.desc}}</p>
            </q-card-main>
            <q-card-separator />
            <q-card-actions class="justify-around">
              <q-btn class="btn shadow-0" outline text-color="secondary" :label="$t('CHAINS_OVERVIEW')" rounded @click="balance(dapp)" />
              <q-btn class="btn shadow-0" outline text-color="secondary" :label="$t('DEPOSIT')" rounded @click="depositFunc(dapp)" />
              <q-btn class="btn shadow-0" outline text-color="secondary" :label="$t('CHECK')" rounded @click="check(dapp)" />
            </q-card-actions>
          </q-card>
        </div>
        <q-btn v-if="dapps.length < pagination.rowsNumber" :label="$t('LOAD_MORE')" @click="loadMore" />
      </q-card-main>
    </q-card>
  
    <q-modal minimized no-backdrop-dismiss v-model="modalInfoShow" content-css="padding: 20px">
      <big>{{$t('DAPP_DETAIL')}}</big>
      <table class="q-table horizontal-separator highlight loose ">
        <thead>
          <tr v-if="balanceType==0">
            <th>{{$t('DAPP_SUPPORT_COIN')}}</th>
            <th>{{'DAPP'+$t('BALANCE')}}</th>
          </tr>
          <tr v-if="balanceType==1">
            <th>{{$t('DAPP_SUPPORT_COIN')}}</th>
            <th>{{'DAPP'+$t('BALANCE')}}</th>
          </tr>
        </thead>
        <tbody v-if="balanceType==0" class='info-tbody'>
          <tr v-for="b in dappBalances" :key="b.currency">
            <td>{{b.currency}}</td>
            <td>{{b.balance | fee(b.asset.precision)}}</td>
          </tr>
        </tbody>
        <tbody v-if="balanceType==1" class='info-tbody'>
          <tr v-for="b in dappBalances" :key="b.currency">
            <td>{{b.currency}}</td>
            <td>{{b.balance | fee(b.precision)}}</td>
          </tr>
        </tbody>
  
      </table>
      <br/>
      <div class="align-center">
        <q-btn color="secondary" @click="()=>{
          this.modalInfoShow = false
          this.dappBalances = {}
          }" :label="$t('label.close')" />
      </div>
    </q-modal>
  
    <q-dialog v-model="dialogShow" prevent-close @ok="onOk" @cancel="onCancel">
      <span slot="title">{{dialog.title}}</span>
      <span slot="message">{{dialog.message}}</span>
  
      <div class="row" slot="body">
        <q-field class="col-12" :label-width="4">
          <q-select :float-label="$t('ASSET')" filter v-model="form.depositName" :options="assetsOpt" :error="$v.form.depositName.$error" error-label="error" />
        </q-field>
        <q-field :label-width="4" :error-label="$t('ERR_ASSET_PRECISION_NOT_CORRECT')" class="col-12">
          <q-input :float-label="$t('AMOUNTS')" @blur="$v.form.amount.$touch" v-model="form.amount" type="number" :error="$v.form.amount.$error" error-label="error" />
        </q-field>
        <q-field v-if="dialog.form==3" :label-width="4" class="col-12">
          <q-input :float-label="$t('ADDRESS')" @blur="validateAddr" v-model="form.address" :error="this.addressError" :error-label="$t('ERR_TOAST_ACCOUNT_INVALID_RECIPIENT')" />
        </q-field>
        <q-field v-if="secondSignature" class="col-12" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="secondPwdError" :label-width="2">
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
import { createInnerTransaction, check58 } from '../utils/asch'
import { required, minValue } from 'vuelidate/lib/validators'
import { secondPwdReg } from '../utils/validators'
import { mapActions, mapGetters } from 'vuex'
import { BigNumber } from 'bignumber.js'

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
      defaultIcon,
      dapps: [],
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
        amount: '',
        address: null,
        secondPwd: ''
      },
      addressError: false,
      secondPwdError: false,
      installed: false
    }
  },
  validations: {
    form: {
      amount: {
        required,
        // numeric,
        minValue: minValue(0),
        outPrecision(val) {
          if (this.selectedAssets && val !== '') {
            let str = BigNumber(val).times(Math.pow(10, this.selectedAssets.precision)).toString()
            return str.indexOf('.') === -1 && str.indexOf('-') === -1
          }
          return false
        }
      },
      depositName: {
        required
      }
    }
  },
  methods: {
    ...mapActions([
      'getBalances',
      'dappMyBalance',
      'broadcastTransaction',
      'appInstalled',
      'appListApi',
      'getAllChains',
      'getInstalledChains',
      'dappContract',
      'deposit',
      'account'
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
        res = await this.getInstalledChains({
          limit: limit,
          offset: (pageNo - 1) * limit
        })
      } else {
        res = await this.getAllChains({
          limit: limit,
          offset: (pageNo - 1) * limit
          // offset: 9
        })
      }
      if (pageNo === 1) {
        this.dapps = res.chains
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
    async getBalance(row, userFlag = false) {
      let res
      let objxas = []
      let res2
      if (!userFlag) {
        res = await this.getBalances({
          address: row.address
        })
        res2 = await this.account({
          address: row.address
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
          b.precision = b.asset.precision
          if (b.currency === 'XAS') b.quantityShow = 100000000
          return b
        })
        if (res2.account !== null) {
          objxas = [
            {
              asset: {
                precision: 8
              },
              currency: 'XAS',
              balance: res2.account.balance
            }
          ]
        }
        this.dappBalances = balences.concat(objxas)
        return balences
      } else {
        translateErrMsg(this.$t, res.error)
        return []
      }
    },
    balance(dapp) {
      this.viewAppBanlance(dapp)
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
    depositFunc(dapp) {
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
      if (this.$v.form.$error || this.$v.form.$invalid || (this.secondSignature && this.secondPwdError)) {
        toastWarn(this.$t('LAUNCH_MODAL.ERR_INVALID_FORM'))
        this.dialogShow = true
        return
      }
      const { name } = this.row
      const assets = this.selectedAssets
      const form = this.dialog.form
      let amount = parseFloat((this.form.amount * Math.pow(10, assets.precision)).toFixed(0))
      let res, trans

      if (form === 1) {
        trans = {
          name: name,
          currency: this.form.depositName,
          amount: amount,
          secondSecret: this.form.secondPwd
        }
        res = await this.deposit(trans)
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
    onError(idx) {
      if (this.$refs['img' + idx]) {
        this.$refs['img' + idx][0].src = defaultIcon
      }
    },
    createMyDapp() {
      openURL('https://github.com/AschPlatform/asch-docs/tree/master/dapp/api')
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
          precision: 8,
          name: depositName
        }
      } else {
        let obj = null
        this.balances.forEach(a => {
          if (a.currency === depositName) {
            obj = a
            obj.precision = a.asset.precision
          }
        })
        return obj
      }
    },
    // asset map for deposit
    assetsOpt() {
      if (this.user && this.balances) {
        let assets = []
        // if (formType === 1) {
        assets = [
          {
            key: 0,
            value: 'XAS',
            label: 'XAS'
          }
        ].concat(
          this.balances.map((item, idx) => {
            return {
              key: idx + 1,
              label: item.asset.name,
              value: item.asset.name
            }
          })
        )
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
.warpper {
  min-width: 1100px;
}

.assets-panel-content {
  background: #ffffff;
  cursor: pointer;
  min-width: 295px;
  margin-right: 39px;
  margin-top: 39px;
}

.tab-panel-container {
  padding: 20px;
}

.underline {
  border-bottom: 1px solid black;
}

.geteway-top {
  margin-bottom: 20px;
}

.card-warpper {
  margin-top: 20px;
}

.btn {
  min-width: 60px;
}
</style>
