<template>
  <div class="tab-panel-container row ">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
      <div class="col-12 shadow-1">
        <q-table :data="appsData?appsData.dapps:[]" :columns="columns" @request="request" :pagination.sync="pagination" :loading="loading" :title="$t('DAPP_LIST')">
  
          <template slot="top-right" slot-scope="props">
             <q-toggle v-model="installed" :label="$t('DAPP_INSTALL_LIST')" color="secondary" @change="(val)=>getDapps(null,null,val)" />
              <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
          </template>

          <q-td slot="body-cell-opt"  slot-scope="props" :props="props">
              <q-btn @click="viewBanlance(props.row)" icon="account balance wallet" size="sm" flat color="primary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DAPP_BANLANCE_DETAIL')}}</q-tooltip>
              </q-btn>
              <q-btn @click="deposit(props.row)" icon="shopping cart" size="sm" flat color="primary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DAPP_DEPOSIT')}}</q-tooltip>
              </q-btn>
              <q-btn @click="download(props.row)" icon="file download" size="sm" flat color="primary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DAPP_DOWNLOAD')}}</q-tooltip>
              </q-btn>
          </q-td>

          <q-td slot="body-cell-id"  slot-scope="props" :props="props">
            <div class="my-label" >
              {{props.value.substring(0,7)}}
              <q-tooltip>{{props.value}}</q-tooltip>
            </div>
          </q-td>
          <q-td slot="body-cell-icon"  slot-scope="props" :props="props">
            <img :src="props.row.icon" style="height:30px" :onerror="props.row.icon = defaultIcon">
          </q-td>
          <q-td slot="body-cell-desc"  slot-scope="props" :props="props">
            <div class="my-label" >
              {{props.value.substring(0,20)}}
              <q-tooltip>{{props.value}}</q-tooltip>
            </div>
          </q-td>
          <q-td slot="body-cell-category"  slot-scope="props" :props="props">
            {{props.value | category($t)}}
          </q-td>

        </q-table>
      </div>
     
      </transition>

    <q-modal minimized no-backdrop-dismiss  v-model="modalInfoShow" content-css="padding: 20px">
      <big>{{$t('DAPP_DETAIL')}}</big>
        <table class="q-table horizontal-separator highlight loose ">
          <thead>
            <tr>
              <th>{{$t('DAPP_SUPPORT_COIN')}}</th>
              <th>{{$t('DAPP_COIN_CURRENT_QUANTITY')}}</th>
              <th>{{'DAPP'+$t('BALANCE')}}</th>
            </tr>
          </thead>
          <tbody class='info-tbody'>
            <tr v-for="b in dappBalances" :key="b.currency" >
              <td >{{b.currency}}</td>
              <td >
                {{b.quantityShow | unit($t)}} 
                <!-- <q-btn @click="withDraw(b.currency)" icon="monetization on" size="sm" flat color="primary" >
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('TRS_TYPE_WITHDRAWAL')}}</q-tooltip>
                </q-btn> -->
              </td>
              <td >{{b.balanceShow}}</td>
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
          <q-select :float-label="$t('ERR_NO_DEPOSIT_COIN')" filter v-model="form.depositName" 
          :options="assetsOpt" :disable="dialog.form==2" :error="$v.form.depositName.$error" error-label="error" />
        </q-field>
        <q-field 
            :label-width="4"
            class="col-12"
          >
            <q-input :float-label="$t('DEPOSIT_AMOUNT')"  @blur="$v.form.amount.$touch" 
            v-model="form.amount" type="number" :decimals="0" :error="$v.form.amount.$error" error-label="error" />
        </q-field>
        <q-field v-if="secondSignature"
          class="col-12"
          :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"
          :error="secondPwdError"
          :label-width="2"
        >
          <q-input :float-label="$t('SECOND_PASSWORD')" v-model="secondPwd" type="password" @blur="validateSecondPwd" />
        </q-field>
      </div>
<template slot="buttons" slot-scope="props">
  <q-btn flat color="primary" :label="$t('label.cancel')" @click="props.cancel" />
  <q-btn flat color="primary" :label="$t('label.ok')" @click="props.ok" />
</template>
    </q-dialog>
    </div>
</template>

<script>
import { api, translateErrMsg } from '../utils/api'
import { toast, toastWarn } from '../utils/util'
import { createInTransfer } from '../utils/asch'
import { required, minValue, numeric } from 'vuelidate/lib/validators'
import { secondPwdReg } from '../utils/validators'
import defaultIcon from '../assets/icon.png'
export default {
  props: ['userObj'],
  components: {},
  data() {
    return {
      appsData: null,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      filter: '',
      loading: false,
      columns: [
        {
          name: 'opt',
          label: this.$t('OPERATION'),
          field: 'opt',
          align: 'center'
        },
        {
          name: 'icon',
          label: this.$t('DAPP_ICON'),
          field: 'icon',
          type: 'string'
        },
        {
          label: this.$t('DAPP_NAME'),
          field: 'name',
          align: 'center'
        },
        {
          name: 'desc',
          label: this.$t('DAPP_DESCRIPTION'),
          field: 'description',
          align: 'center'
        },
        {
          label: 'ID',
          name: 'id',
          field: 'transactionId'
        },
        {
          name: 'category',
          label: this.$t('TYPE'),
          field: 'category',
          align: 'center'
        }
      ],
      modalInfoShow: false,
      row: {},
      secondPwd: '',
      secondPwdError: false,
      dialogShow: false,
      dialog: {
        title: '',
        message: '',
        form: 1 // 1 deposit; 2 withDraw
      },
      dappBalances: [],
      form: {
        depositName: '',
        amount: null
      },
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
    async request(props) {
      await this.getDapps(props.pagination, props.filter)
    },
    async getDapps(pagination = {}, filter = '', installed = false) {
      this.loading = true
      if (pagination && pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = {}
      if (installed) {
        res = await api.appInstalled({
          limit: limit,
          offset: (pageNo - 1) * limit
        })
      } else {
        res = await api.appList({
          limit: limit,
          offset: (pageNo - 1) * limit
        })
      }
      this.appsData = res
      // set max
      this.pagination.rowsNumber = res.count.count || 0
      this.loading = false
      return res
    },
    // viewInfo(row) {
    //   this.row = row
    //   this.modalInfoShow = true
    // }
    async viewBanlance(row) {
      let res = await api.appBalance({
        appId: row.transactionId
      })
      if (res.success === true) {
        this.dappBalances = res.balances.map(b => {
          // init XAS data
          if (b.currency === 'XAS') b.quantityShow = 100000000
          return b
        })
        this.modalInfoShow = true
      } else {
        translateErrMsg(this.$t, res.error)
      }
    },
    withDraw(name) {
      const t = this.$t
      this.form.depositName = name
      this.modalInfoShow = false
      this.dialog = {
        title: t('TRS_TYPE_WITHDRAWAL'),
        message: t('OPERATION_REQUIRES_FEE' + '0.1 XAS'),
        form: 2
      }
      this.dialogShow = true
    },
    async deposit(row) {
      const t = this.$t
      this.dialog = {
        title: t('DAPP_DEPOSIT'),
        message: t('DAPP_COIN_FEE'),
        form: 1
      }
      this.row = row
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
      let amount, trans
      if (this.dialog.form === 1) {
        amount = parseFloat((this.form.amount * Math.pow(10, assets.precision)).toFixed(0))
        trans = createInTransfer(
          transactionId,
          this.form.depositName,
          amount,
          this.user.secret,
          this.secondPwd
        )
      } else {
        // TODO
      }

      let res = await api.broadcastTransaction(trans)
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
    info(msg) {
      toast(msg)
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
    }
  },
  async mounted() {
    if (this.user) this.getDapps()
    this.$root.$emit('getAssetsList')
  },
  computed: {
    user() {
      return this.userObj
    },
    secondSignature() {
      return this.user ? this.user.account.secondSignature : null
    },
    pwdValid() {
      return !secondPwdReg.test(this.secondPwd)
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
      let assets = [
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
      return assets
    }
  },
  watch: {
    userObj(val) {
      if (val) {
        this.getDapps()
      }
    },
    pageNo(val) {
      this.getDapps()
    },
    installed(val) {
      this.getDapps(null, null, val)
    }
  }
}
</script>

<style lang="stylus">
</style>
