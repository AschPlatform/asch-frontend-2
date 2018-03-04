<template>
  <div class="tab-panel-container row ">
    <transition  
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    mode="out-in">
      <div class="col-12 shadow-1">
        <q-table :data="appsData?appsData.dapps:[]" :columns="columns" @request="request" :pagination.sync="pagination" 
        :loading="loading" :title="$t('DAPP_LIST')">
          
         <template slot="top-right" slot-scope="props">
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
              <td >{{b.quantityShow | unit($t)}}</td>
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
      <span slot="title">{{$t('TRS_TYPE_DEPOSIT')}}</span>

      <div class="row" slot="body">
        <q-field 
          class="col-12"
          error-label="error"
          :label-width="4">
          <q-select :float-label="$t('ERR_NO_DEPOSIT_COIN')" filter v-model="form.depositName" 
          :options="assets" :error="$v.depositName.$error" error-label="error"/>
        </q-field>
        <q-field 
            error-label="error"
            :label-width="4"
            class="col-12"
          >
            <q-input :float-label="$t('DEPOSIT_AMOUNT')"  @blur="$v.issuerNum.$touch" 
            v-model="form.issuerNum" type="number" :decimals="0" :error="$v.issuerNum.$error" />
        </q-field>
        <q-field v-if="secondSignature"
          class="col-12"
          :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"
          :label-width="2"
        >
          <q-input :float-label="$t('SECOND_PASSWORD')" v-model="secondPwd" type="password" />
        </q-field>
      </div>
      <template slot="buttons" slot-scope="props">
          <q-btn  flat color="primary" :label="$t('label.cancel')" @click="props.cancel" />
          <q-btn  flat color="primary" :label="$t('label.ok')" @click="props.ok" />
      </template>
    </q-dialog>
    </div>
</template>

<script>
import { api, translateErrMsg } from '../utils/api'
import { toast } from '../utils/util'
import {} from '../utils/asch'
import { required, numeric, minValue, secondPwdReg } from 'vuelidate/lib/validators'
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
      dialogShow: false,
      dialog: {
        title: '',
        message: ''
      },
      defaultIcon: defaultIcon,
      dappBalances: [],
      form: {
        depositName: '',
        issuerNum: ''
      }
    }
  },
  validations: {
    issuerNum: {
      required,
      numeric,
      minValue: minValue(1)
    },
    depositName: {
      required
    }
  },
  methods: {
    async request(props) {
      await this.getDapps(props.pagination, props.filter)
    },
    async getDapps(pagination = {}, filter = '', installed = false) {
      this.loading = true
      if (pagination.page) this.pagination = pagination
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
      this.pagination.rowsNumber = res.count
      this.loading = false
      return res
    },
    // viewInfo(row) {
    //   this.row = row
    //   this.modalInfoShow = true
    // }
    async viewBanlance(row) {
      let res = await api.appBalance({ appId: row.transactionId })
      if (res.success === true) {
        this.dappBalances = res.balances.map(b => {
          // init XAS data
          if (b.currency === 'XAS') b.quantityShow = 100000000
        })
        this.modalInfoShow = true
      } else {
        translateErrMsg(this.$t, res.error)
      }
    },
    deposit(row) {
      const t = this.$t

      this.dialog = {
        title: t('TRS_TYPE_UIA_ISSUE'),
        message: `${t('CANT_ROLLBACK')}, ${t('REQUIRES_FEE')} 0.1 XAS`,
        form: 2
      }
      this.row = row
      this.dialogShow = true
    },
    async onOk() {
      
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
    }
  }
}
</script>

<style lang="stylus">
</style>
