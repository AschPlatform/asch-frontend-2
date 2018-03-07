<template>
  <div class="tab-panel-container row  ">
  
    <q-card class="row col-12" >
      <q-card-title class='col-12'>
        {{$t('DELEGATE_INFO')}}
        <span slot="subtitle">{{delegate?delegate.username:''}}{{`(${forgingEnabled?$t('FORGING_ENABLE'):$t('FORGING_DISABLE')})`}}</span>
        <div slot="right" class="items-center">
          <q-btn v-if="!delegate" flat round icon="assignment" @click="registerDelegate">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DELEGATE_REGISTER')}}</q-tooltip>
          </q-btn>
          <q-btn :loading="refreshLoading" flat round icon="refresh" @click="refreshDelegateInfo">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('label.refresh')}}</q-tooltip>
          </q-btn>
        </div>
      </q-card-title>
      <q-card-main class="column ">
        <table v-if="delegate" class="q-table horizontal-separator highlight loose ">
          <tbody class='info-tbody'>
            <tr>
              <td >{{$t('TOTAL_EARNINGS')}}</td>
              <td >{{delegate.rewards}}</td>
            </tr>
            <tr>
              <td >{{$t('RANKING')}}</td>
              <td >{{delegate.rate}}</td>
            </tr>
            <tr>
              <td >{{$t('PRODUCTIVITY')}}</td>
              <td >{{delegate.productivity}}</td>
            </tr>
            <tr>
              <td >{{$t('APPROVAL')}}</td>
              <td >{{delegate.approval+'%'}}</td>
            </tr>
          </tbody>
        </table>
      </q-card-main>
  
    </q-card>
  
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
      <div class="col-12 shadow-1">
        <q-table :data="blocks" :columns="columns" @request="request" :pagination.sync="pagination" :loading="loading" :title="$t('PRODUCED_BLOCKS')">
  
          <template slot="top-right" slot-scope="props">
            <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
          </template>

          <q-td slot="body-cell-id"  slot-scope="props" :props="props">
            <div class="my-label" >
              {{props.value.substring(0,7)}}
              <q-tooltip>{{props.value}}</q-tooltip>
            </div>
          </q-td>
          <q-td slot="body-cell-icon"  slot-scope="props" :props="props">
            <img :src="props.row.icon" style="height:56px" :onerror="props.row.icon = defaultIcon">
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


    <q-dialog
      v-model="dialogShow"
      prevent-close
      @ok="onOk"
      @cancel="onCancel"
    >
      <!-- This or use "title" prop on <q-dialog> -->
      <span slot="title">{{$t('REGISTER_DELEGATE')}}</span>
      <span slot="message">{{$t('NEED_PAY')}}</span>

      <div class="row" slot="body">
        <q-field 
            class="col-12"
          >
            <q-input :float-label="$t('DELEGATE_NAME')"  
            v-model="form.delegateName"  />
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
    </div>
</template>

<script>
import { api, translateErrMsg } from '../utils/api'
import { toast, toastWarn } from '../utils/util'
import { fullTimestamp, convertFee } from '../utils/asch'
import { secondPwdReg } from '../utils/validators'

export default {
  props: ['userObj'],
  components: {},
  data() {
    return {
      delegate: null,
      blocks: [],
      forgingEnabled: false,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      filter: '',
      loading: false,
      columns: [
        {
          name: 'height',
          label: this.$t('HEIGHT'),
          field: 'height',
          align: 'center'
        },
        {
          name: 'timestamp',
          label: this.$t('DATE'),
          field: 'timestamp',
          type: 'string',
          format: value => {
            return this.formatTimestamp(value)
          }
        },
        {
          label: 'ID',
          name: 'id',
          field: 'id'
        },
        {
          name: 'numberOfTransactions',
          label: this.$t('TRANSACTIONS'),
          field: 'numberOfTransactions',
          type: 'string',
          align: 'right'
        },
        {
          label: this.$t('AMOUNTS'),
          field: 'totalAmount',
          align: 'right'
        },
        {
          label: this.$t('FEES'),
          field: 'totalFee',
          align: 'right'
        },
        {
          name: 'reward',
          label: this.$t('REWARDS'),
          field: 'reward',
          align: 'right'
        }
      ],
      modalInfoShow: false,
      row: {},
      dialogShow: false,
      refreshLoading: false,
      form: {
        delegateName: '',
        secondPwd: ''
      },
      secondPwdError: false
    }
  },
  methods: {
    async request(props) {
      await this.getBlocks(props.pagination, props.filter)
    },
    async getBlocks(pagination = {}, filter = '', installed = false) {
      this.loading = true
      if (pagination && pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = {}
      res = await api.blocks({
        generatorPublicKey: this.publicKey,
        limit: limit,
        offset: (pageNo - 1) * limit,
        orderBy: 'height:desc'
      })
      this.blocks = res.blocks
      // set max
      this.pagination.rowsNumber = res.count
      this.loading = false
      return res
    },
    async getDelegate() {
      let res = await api.blockforging({
        publicKey: this.publicKey
      })
      if (res.success === true) {
        this.delegate = res.delegate
      }
      return res
    },
    async getForgingStatus() {
      let res = await api.forgingStatus({
        publicKey: this.publicKey
      })
      if (res.success === true) {
        this.forgingEnabled = res.enabled
      }
      return res
    },
    async refreshDelegateInfo() {
      this.refreshLoading = true
      await this.getDelegate()
      this.refreshLoading = false
    },
    init() {
      this.getDelegate()
      this.getForgingStatus()
      this.getBlocks()
    },
    formatTimestamp(timestamp) {
      return fullTimestamp(timestamp)
    },
    registerDelegate() {
      this.dialogShow = true
    },
    validateSecondPwd(val) {
      let isValid = this.pwdValid
      this.secondPwdError = isValid
      return isValid
    },
    onCancel() {
      this.dialogShow = false
    },
    onOk() {}
  },
  mounted() {
    if (this.user) {
      this.init()
    }
  },
  computed: {
    user() {
      return this.userObj
    },
    publicKey() {
      if (this.user) return this.user.account.publicKey
    },
    secondSignature() {
      return this.user && this.user.account ? this.user.account.secondSignature : null
    },
    pwdValid() {
      return !secondPwdReg.test(this.form.secondPwd)
    }
  },
  watch: {
    userObj(val) {
      if (val && val.account.publicKey) {
        this.init()
      }
    }
  }
}
</script>

<style>

</style>
