<template>
  <q-page padding class="self-center row">
    <div class="col-8">
      <big>{{$t('ALL_BLOCKS')}}</big>
      <q-table :data="blocksData" :columns="columns" @request="request" :pagination.sync="pagination" :loading="loading" :title="$t('PRODUCED_BLOCKS')">
        <template slot="top-left" slot-scope="props">
            <q-search hide-underline :placeholder="$t('ACCOUNT_TYPE_HINT')" type="number" v-model="filter" :debounce="600" />
        </template>

        <template slot="top-right" slot-scope="props">
          <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
          <q-btn :loading="loading" flat round icon="refresh" @click="refresh" />
        </template>

          <q-td slot="body-cell-id"  slot-scope="props" :props="props">
            <div class="my-label text-primary" @click="()=>showBlockInfo(props.row.id)" >
              {{props.value.substring(0,7)}}
            </div>
          </q-td>
          
          <q-td slot="body-cell-height"  slot-scope="props" :props="props">
            <div class="text-primary" @click="()=>showBlockInfo(props.row.id)" >
              {{props.value }}
            </div>
          </q-td>
          <q-td slot="body-cell-reward"  slot-scope="props" :props="props">
              {{props.value | fee}}
          </q-td>
          
          <q-td slot="body-cell-generatorId"  slot-scope="props" :props="props">
            <div class="text-primary" @click="()=>showAccountInfo(props.row.generatorId)" >

              {{props.value}}
            </div>
          </q-td>
          <q-td slot="body-cell-numberOfTransactions"  slot-scope="props" :props="props">
            <div class="text-primary" @click="()=>showTransInfo(props.row.id)" >
              {{props.value}}
            </div>
          </q-td>

        </q-table>
      </div>
      <div class="col-4">
        <q-card inline class="q-px-sm">
          <q-card-title>
          {{$t('DELEGATE_INFO')}}
          </q-card-title>
          <q-card-separator />
          <q-card-main align="center">
            <span class="block">{{$t('NOT_DELEGATE')}}</span>
            <q-btn color="primary" @click="action">{{$t(btnInfo)}}</q-btn>
          </q-card-main>
        </q-card>
        <q-card inline class="q-px-sm">
          <q-card-title>
          {{$t('MY_FORGING')}}
          </q-card-title>
          <q-card-separator />
          <q-card-main align="center">
            <span>{{$t('NOT_DELEGATE')}}</span>
            <q-btn v-if="this.isDelegate" color="primary" @click="action">{{$t('CHECK')}}</q-btn>
          </q-card-main>
        </q-card>
      </div>

      <!-- below are modals -->
      <q-modal minimized   v-model="modalInfoShow" content-css="padding: 20px">
      <big>{{$t('DAPP_DETAIL')}}</big>
      <table class="q-table horizontal-separator highlight loose ">
        <tbody v-if="type==1" class='info-tbody'>
          <tr v-clipboard="row.id" @success="info('copy ID success...')">
            <td >{{'ID'}}</td>
            <td >{{row.id}}</td>
          </tr>
          <tr>
            <td >{{'VERSION'}}</td>
            <td >{{row.version}}</td>
          </tr>
          <tr v-clipboard="this.formatTimestamp(row.timestamp)" @success="info('copy date success...')">
            <td >{{$t('DATE')}}</td>
            <td >{{this.formatTimestamp(row.timestamp)}}</td>
          </tr>
          <tr>
            <td >{{'HEIGHT'}}</td>
            <td >{{row.height}}</td>
          </tr>
          <tr @click="()=>{modalInfoShow = false;showBlockInfo(row.previousBlock)}">
            <td >{{$t('PREVIOUS_BLOCK')}}</td>
            <td class="text-primary">{{row.previousBlock}}</td>
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
            <td class="text-primary">{{row.generatorId }}</td>
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
        color="primary"
        @click="()=>{
          this.modalInfoShow = false
          this.row = {}
          }"
        :label="$t('label.close')"
      />
    </q-modal>
  </q-page>
</template>

<script>
import { QTable, QPage } from 'quasar'
// import { api } from '../utils/api'
// import { toast } from '../utils/util'
import { fullTimestamp } from '../utils/asch'
import { secondPwdReg } from '../utils/validators'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['userObj'],
  components: {
    QTable,
    QPage
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
          label: this.$t('TRANSACTIONS'),
          field: 'numberOfTransactions',
          type: 'string',
          align: 'right'
        },
        {
          label: this.$t('TOTAL') + this.$t('AMOUNTS'),
          field: 'totalAmount',
          align: 'right'
        },
        {
          label: this.$t('TOTAL') + this.$t('FEES'),
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
      type: 0,
      // is this user delegate
      isDelegate: false
    }
  },
  methods: {
    ...mapActions(['blocks', 'blockDetail', 'blockforging', 'forgingStatus', 'transactions']),
    async refresh() {
      await this.getBlocks(this.defaultPage, '')
    },
    async request(props) {
      await this.getBlocks(props.pagination, props.filter)
    },
    async getBlocks(pagination = {}, filter = '') {
      this.loading = true
      if (pagination && pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let condition = {
        limit: limit,
        offset: (pageNo - 1) * limit,
        orderBy: 'height:desc'
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
      }
      return res
    },
    async getForgingStatus() {
      let res = await this.forgingStatus({
        publicKey: this.publicKey
      })
      if (res.success === true) {
        this.forgingEnabled = res.enabled
      }
      return res
    },
    init() {
      this.getBlocks()
    },
    formatTimestamp(timestamp) {
      return fullTimestamp(timestamp)
    },
    async showBlockInfo(id) {
      let res = await this.blockDetail({ id })
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
    }
  },
  mounted() {
    if (this.user) {
      this.init()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    },
    publicKey() {
      if (this.user) return this.user.account.publicKey
    },
    secondSignature() {
      return this.user && this.user.account ? this.user.account.secondSignature : null
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
    btnInfo() {
      return this.isDelegate ? this.$t('CHECK') : this.$t('DELEGATE_REGISTER')
    }
  },
  watch: {
    userInfo(val) {
      if (val && val.account.publicKey) {
        this.init()
      }
    },
    filter(val) {
      this.getBlockDetail()
    }
  }
}
</script>

<style>

</style>
