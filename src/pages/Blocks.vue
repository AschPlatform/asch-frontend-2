<template>
  <q-page class="self-center blocks-container">
    <div class="blocks-content row">
      <div class="col-9">
        <q-table :data="blocksData" :columns="columns" @request="request" :pagination.sync="pagination" :loading="loading" :title="$t('PRODUCED_BLOCKS')">
          <template slot="top-left" slot-scope="props">
                <big>{{isOwn === false ? $t('ALL_BLOCKS') : $t('MY_BLOCKS')}}</big>
        </template>

        <template slot="top-right" slot-scope="props">
          <q-search class="blocks-search text-secondary" hide-underline :placeholder="$t('ACCOUNT_TYPE_HINT')" type="number" v-model="filter" :debounce="600" />
          <q-btn class="text-secondary" :loading="loading" flat round icon="refresh" @click="refresh" />
          <q-btn class="text-secondary" flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
        </template>

          <q-td slot="body-cell-id"  slot-scope="props" :props="props">
            <div class="my-label text-secondary cursor-pointer" @click="()=>showBlockInfo(props.row.id)" >
              {{props.value.substring(0,7)}}
            </div>
          </q-td>
          <q-td slot="body-cell-height"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="()=>showBlockInfo(props.row.id)" >
              {{props.value }}
            </div>
          </q-td>
          <q-td slot="body-cell-reward"  slot-scope="props" :props="props">
              {{props.value | fee}}
          </q-td>
          
          <q-td slot="body-cell-generatorId"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="()=>showAccountInfo(props.row.generatorId)" >

              {{props.value}}
            </div>
          </q-td>
          <q-td slot="body-cell-numberOfTransactions"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="()=>showTransInfo(props.row.id)" >
              {{props.value}}
            </div>
          </q-td>
        </q-table>
      </div>
      <div class="col-3">
        <div class="blocks-container-right">
        <q-card class="q-px-sm">
          <q-card-title>
          {{$t('DELEGATE_INFO')}}
          </q-card-title>
          <q-card-separator />
          <q-card-main class="blocks-padding-40" align="center" v-if="!this.isDelegate">
            <q-btn class="" color="secondary" @click="registerDelegate">{{$t('DELEGATE_REGISTER')}}</q-btn>
            <span class="block margin-t-10 font-12">{{$t('NOT_DELEGATE')}}</span>
          </q-card-main>
          <q-card-main align="center" v-else>
            <div v-if="delegate">
              <span class="block margin-t-20 text-secondary font-30 font-weight">{{delegate.name}}</span>
            <span class="block margin-t-20">
              {{$t('DELEGATE_POLLRATE')+':'}}
              <a class="text-secondary font-weight font-22 text-decoration-none vertical-align-baseline">{{delegate.approval+'%'}}</a>
              </span>
            <span class="block margin-t-10">
              {{$t('DELEGATE_RANK')+':'}}
              <a class="text-secondary font-weight font-22 text-decoration-none vertical-align-baseline">{{delegate.rate}}</a>
              </span>
            </div>
            
          </q-card-main>
        </q-card>
        <q-card class="q-px-sm margin-t-20" v-if="this.isDelegate">
          <q-card-title>
          {{$t('MY_FORGING')}}
          </q-card-title>
          <q-card-separator />
          <q-card-main class="padding-b-40" v-if="delegate" align="center">
            <q-btn class="font-30" @click="changeData" flat text-color="secondary">{{delegate.producedblocks}}</q-btn>
            <span class="block">
              {{$t('DELEGATE_VOTERATE')+':'}}
              <a class="text-secondary font-weight font-22 text-decoration-none vertical-align-baseline" href="javascript:;">{{delegate.productivity+'%'}}</a>
            </span>
          </q-card-main>
        </q-card>
        </div>
      </div>

      <!-- below are modals -->
      <q-modal minimized   v-model="modalInfoShow" content-css="padding: 20px">
      <big>{{$t('DAPP_DETAIL')}}</big>
      <table class="q-table horizontal-separator highlight loose blocks-datail-table">
        <tbody v-if="type==1" class='info-tbody'>
          <tr v-clipboard="row.id || 'no data'" @success="info('copy ID success...')">
            <td >{{'ID'}}</td>
            <td >{{row.id}}</td>
          </tr>
          <tr>
            <td >{{'VERSION'}}</td>
            <td >{{row.version}}</td>
          </tr>
          <tr v-clipboard="this.formatTimestamp(row.timestamp) || 'no data'" @success="info('copy date success...')">
            <td >{{$t('DATE')}}</td>
            <td >{{this.formatTimestamp(row.timestamp)}}</td>
          </tr>
          <tr>
            <td >{{'HEIGHT'}}</td>
            <td >{{row.height}}</td>
          </tr>
          <tr @click="()=>{modalInfoShow = false;showBlockInfo(row.previousBlock)}">
            <td >{{$t('PREVIOUS_BLOCK')}}</td>
            <td class="text-secondary">{{row.previousBlock}}</td>
          </tr>
          <tr>
            <td >{{$t('TOTAL_AMOUNTS')}}</td>
            <td >{{row.numberOfTransactions}}</td>
          </tr>
          <tr>
            <td >{{$t('TOTAL_AMOUNTS')}}</td>
            <td >{{row.totalAmount}}</td>
          </tr>
          <tr >
            <td >{{$t('REWARD')}}</td>
            <td >{{row.reward | fee}}</td>
          </tr>
          <tr >
            <td >{{$t('PAYLOAD_HASH')}}</td>
            <td >{{row.payloadHash}}</td>
          </tr>
          <tr @click="()=>{modalInfoShow = false;showAccountInfo(row.generatorId)}">
            <td >{{$t('PRODUCER')}}</td>
            <td class="text-secondary">{{row.generatorId }}</td>
          </tr>
          <tr >
            <td >{{$t('PRODUCER_PUBKEY')}}</td>
            <td >{{row.generatorPublicKey}}</td>
          </tr>
          
        </tbody>
        <tbody v-if="type==3" class='info-tbody'>
          <tr>
            <td>{{'ID'}}</td>
            <td>{{$t('CONFIRMATIONS')}}</td>
            <td>{{$t('AMOUNTS')}}</td>
            <td>{{$t('FEES')}}</td>
            <td>{{$t('DATE')}}</td>
          </tr>
          <tr v-for="trans in row" :key="trans.id">
            <td >{{trans.id}}</td>
            <td >{{trans.confirmations }}</td>
            <td >{{trans.amount | fee}}</td>
            <td >{{trans.fee }}</td>
            <td >{{trans.timestamp | time}}</td>
          </tr>
        </tbody>
      </table>
      <br/>
      <q-btn
        color="secondary"
        @click="()=>{
          this.modalInfoShow = false
          this.row = {}
          }"
        :label="$t('label.close')"
      />
    </q-modal>

    <user-agreement-modal :show="isModalShow" @confirm="callRegister" @cancel="closeModal" :title="$t('DELEGATE_TITLE')" :content="$t('AGREEMENT_DELEGATE_TITLE_CONTENT')" :tips="$t('DELEGATE_TITLE')+$t('COST_FEE',{num:100})"/>
    </div>
    
  </q-page>
</template>

<script>
import {
  QTable,
  QPage,
  QSearch,
  QBtn,
  QCard,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QModal,
  QField,
  QInput,
  QTd
} from 'quasar'
import { toast, toastInfo, translateErrMsg, prompt } from '../utils/util'
import { fullTimestamp, createDelegate } from '../utils/asch'
import { secondPwdReg } from '../utils/validators'
import { mapGetters, mapActions } from 'vuex'
import UserAgreementModal from '../components/UserAgreementModal'
import asch from '../utils/asch-v2'

export default {
  props: ['userObj'],
  components: {
    UserAgreementModal,
    QTable,
    QPage,
    QSearch,
    QBtn,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QModal,
    QField,
    QInput,
    QTd
  },
  data() {
    return {
      delegate: null,
      blocksData: [],
      forgingEnabled: false,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 20
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
          align: 'center',
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
          label: this.$t('PRODUCER'),
          name: 'generatorId',
          field: 'generatorId'
        },
        {
          name: 'numberOfTransactions',
          label: this.$t('TRANSACTIONS_COUNT'),
          field: 'count',
          type: 'string',
          align: 'right'
        },
        // {
        //   label: this.$t('TOTAL') + this.$t('AMOUNTS'),
        //   field: 'totalAmount',
        //   align: 'right'
        // },
        // {
        //   label: this.$t('TOTAL') + this.$t('FEES'),
        //   field: 'totalFee',
        //   align: 'right'
        // },
        {
          name: 'reward',
          label: this.$t('REWARDS'),
          field: 'reward',
          align: 'right'
        }
      ],
      modalInfoShow: false,
      row: {},
      type: 0,
      // is this user delegate
      // isDelegate: false,
      dialogShow: false,
      isModalShow: false,
      form: {
        delegateName: '',
        secondPwd: ''
      },
      isOwn: false,
      secondPwd: ''
    }
  },
  methods: {
    ...mapActions([
      'blocks',
      'blockDetail',
      'blockforging',
      'forgingStatus',
      'transactions',
      'broadcastTransaction'
    ]),
    async refresh() {
      await this.getBlocks(this.defaultPage, '')
    },
    async request(props) {
      await this.getBlocks(props.pagination, props.filter)
    },
    async getBlocks(pagination = {}, filter = '') {
      this.loading = true
      let condition = []
      // is own judge
      if (!this.isOwn) {
        if (pagination && pagination.page) {
          this.pagination = pagination
        }
        let limit = this.pagination.rowsPerPage
        let pageNo = this.pagination.page
        condition = {
          limit: limit,
          offset: (pageNo - 1) * limit,
          orderBy: 'height:desc'
        }
      } else {
        if (pagination && pagination.page) {
          this.pagination = pagination
        }
        let limit = this.pagination.rowsPerPage
        let pageNo = this.pagination.page
        condition = {
          generatorPublicKey: this.publicKey,
          limit: limit,
          offset: (pageNo - 1) * limit,
          orderBy: 'height:desc'
        }
      }
      let res = await this.blocks(condition)
      this.blocksData = res.blocks
      // set max
      this.pagination.rowsNumber = res.count
      this.loading = false
      return res
    },
    async getBlockDetail() {
      let res = await this.blockDetail({
        height: this.filter
      })
      this.pagination.rowsNumber = 1
      this.blocksData = [res.block]
      this.loading = false
      return res
    },
    async getDelegate() {
      let res = await this.blockforging({
        publicKey: this.publicKey
      })
      if (res.success === true) {
        this.delegate = res.delegate
        // this.isDelegate = true
      }
      return res
    },
    init() {
      this.getBlocks()
      this.getDelegate()
    },
    formatTimestamp(timestamp) {
      return fullTimestamp(timestamp)
    },
    async showBlockInfo(id) {
      let res = await this.blockDetail({
        id
      })
      if (res.success === true) {
        this.row = res.block
        this.modalInfoShow = true
        this.type = 1
      }
    },
    async showAccountInfo(address) {
      this.$root.$emit('openAccountModal', address)
    },
    async showTransInfo(blockId) {
      let res = await this.transactions({
        blockId: blockId
      })
      if (res.success === true) {
        this.row = res.transactions
        this.modalInfoShow = true
        this.type = 3
      }
    },
    async registerDelegate() {
      if (!this.user.account.name) {
        toastInfo(this.$t('PLEASE_SET_NAME'))
        return null
      }
      if (!this.user.account.isDelegate === 0) {
        toastInfo(this.$t('AGENT_ALREADY'))
        return null
      }
      if (this.user.account.isAgent) {
        toastInfo(this.$t('AGENT_CAN_NOT_BE_DELEGATE'))
        return null
      }
      this.isModalShow = true
    },
    callRegister() {
      const t = this.$t
      if (this.secondSignature) {
        prompt(
          {
            title: t('DELEGATE_TITLE'),
            message: t('ACCOUNT_TYPE2_HINT'),
            prompt: {
              model: '',
              type: 'password' // optional
            }
          },
          data => {
            this.secondPwd = data
            this.boardTransaction()
          }
        )
        return
      }
      this.boardTransaction()
    },
    async boardTransaction() {
      let trans = asch.registerDelegate(this.user.secret, this.secondPwd || '')
      let res = await this.broadcastTransaction(trans)
      if (res.success === true) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        this.closeModal()
      } else {
        translateErrMsg(this.$t, res.error)
      }
    },
    closeModal() {
      this.isModalShow = false
    },
    changeData() {
      this.isOwn = !this.isOwn
      this.getBlocks(this.defaultPage, '')
    }
  },
  mounted() {
    if (this.userInfo) {
      this.init()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    },
    publicKey() {
      if (this.user) return this.user.publicKey
    },
    secondSignature() {
      return this.user && this.user.account ? this.user.account.secondPublicKey : null
    },
    pwdValid() {
      return !secondPwdReg.test(this.form.secondPwd)
    },
    defaultPage() {
      return {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 20
      }
    },
    isDelegate() {
      if (this.userInfo && this.userInfo.account) {
        return this.userInfo.account.isDelegate === 1
      } else {
        return false
      }
    }
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.init()
      }
    },
    filter(val) {
      this.getBlockDetail()
    },
    isOwn(val) {
    },
    pagination(val) {
    }
  }
}
</script>

<style lang="stylus" scoped>
.blocks-container {
  padding: 20px;
}

.blocks-content {
  padding: 20px;
  background: #ffffff;
  border-radius: 6px;
}

.blocks-container-right {
  padding-left: 20px;
}

.blocks-search {
  border: 1px solid #cccccc;
  border-radius: 15px;
}
</style>
