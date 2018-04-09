<template>
<div>

  <q-table :data="trans" 
    :columns="columns" row-key="id" :pagination.sync="pagination"
    @request="request" :loading="loading" :filter="filter" 
    :visible-columns="visibleColumns" :title="$t('DAPP_TRANSACTION_RECORD')">

    <template slot="top-right" slot-scope="props">
      <q-table-columns color="primary" class="q-mr-sm" v-model="visibleColumns" :columns="columns" />
      <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
    </template>

    

    <q-td slot="body-cell-id" slot-scope="props" :props="props">
      <div class="my-label" >
        {{props.value.substring(0,7)}}
        <q-tooltip>{{props.value}}</q-tooltip>
      </div>
    </q-td>

    <q-td slot="body-cell-opt"  slot-scope="props" :props="props">
      <q-btn @click="getDataInfo(props)" icon="remove red eye" size="sm" flat color="primary" >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DAPP_DETAIL')}}</q-tooltip>
        </q-btn>
    </q-td>

    <q-td slot="body-cell-message" slot-scope="props" :props="props">
      {{props.value}}
      <q-popover v-if="props.value" ref="popover-msg">
        <div class="light-paragraph">{{props.value}}</div>
      </q-popover>
    </q-td>

    <q-td slot="body-cell-amount" slot-scope="props" :props="props">
      {{getAmountNFee(props.row)}}
    </q-td>

    <q-td slot="body-cell-senderId" class="table-address" slot-scope="props" :props="props">
      <a @click="getAccountInfo(props.row.senderId)">
              {{matchSelf(props.value)?'Me':props.value}}
            </a>
      <q-tooltip v-if="!matchSelf(props.value)">{{props.value}}</q-tooltip>
    </q-td>

    <q-td slot="body-cell-recipientId" slot-scope="props" :props="props">
      <div v-if="props.value">
        <a @click="getAccountInfo(props.row.recipientId)">
                {{matchSelf(props.value)?'Me':props.value}}
              </a>
        <q-tooltip v-if="!matchSelf(props.value)" ref="popover-rec">
          {{props.value}}
        </q-tooltip>
      </div>
      <div v-else>SYSTEM</div>
    </q-td>
  </q-table>

  <q-modal minimized no-backdrop-dismiss  v-model="modalInfoShow" content-css="padding: 20px">
      <big>{{$t('DAPP_DETAIL')}}</big>
      <table v-if="modalInfoShow" class="q-table horizontal-separator highlight loose ">
        <tbody class='info-tbody'>
          <tr v-clipboard="row.id" @success="info('copy ID success...')">
            <td >{{'ID'}}</td>
            <td >{{row.id}}</td>
          </tr>
          <tr>
            <td >{{$t('TYPE')}}</td>
            <td >{{getTransType(row.type)}}</td>
          </tr>
          <tr  v-clipboard="row.senderId" @success="info('copy senderId success...')">
            <td >{{$t('SENDER')}}</td>
            <td >{{row.senderId}}</td>
          </tr>
          <tr v-clipboard="row.recipientId" @success="info('copy recipientId success...')">
            <td >{{$t('RECIPIENT')}}</td>
            <td >{{row.recipientId}}</td>
          </tr>
          <tr v-clipboard="this.formatTimestamp(row.timestamp)" @success="info('copy date success...')">
            <td >{{$t('DATE')}}</td>
            <td >{{this.formatTimestamp(row.timestamp)}}</td>
          </tr>
          <tr v-clipboard="getAmountNFee(row)" @success="info('copy amount success...')">
            <td >{{this.$t('AMOUNTS') + '(' + this.$t('FEES') + ')'}}</td>
            <td >{{getAmountNFee(row)}}</td>
          </tr>
          <tr v-clipboard="row.message" @success="info('copy message success...')">
            <td >{{$t('REMARK')}}</td>
            <td >{{row.message}}</td>
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
        label="Close"
      />
    </q-modal>
</div>
</template>
<script>
import { fullTimestamp, convertFee } from '../utils/asch'
import { QTable, QTd, QTableColumns, QTooltip } from 'quasar'
import { transTypes } from '../utils/constants'
import { mapActions } from 'vuex'

export default {
  name: 'TransTableContainer',
  props: ['userInfo', 'currency'],
  components: { QTable, QTd, QTableColumns, QTooltip },
  data() {
    return {
      trans: [],
      loading: false,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      columns: [
        {
          name: 'opt',
          label: this.$t('OPERATION'),
          field: 'opt',
          align: 'center'
        },
        {
          name: 'id',
          label: 'ID',
          field: 'id'
        },
        {
          name: 'type',
          label: this.$t('TYPE'),
          field: 'type',
          align: 'center',
          filter: true,
          format: value => {
            return this.getTransType(value)
          }
        },
        {
          name: 'senderId',
          label: this.$t('SENDER'),
          field: 'senderId',
          align: 'center',
          format: value => {
            let isMySelf = this.matchSelf(value)
            return isMySelf ? 'Me' : value
          }
        },
        {
          name: 'recipientId',
          label: this.$t('RECIPIENT'),
          field: 'recipientId',
          align: 'center',
          format: value => {
            if (value === '') {
              return 'SYSTEM'
            }
            let isMySelf = this.matchSelf(value)
            return isMySelf ? 'Me' : value
          }
        },
        {
          name: 'timestamp',
          label: this.$t('DATE'),
          field: 'timestamp',
          width: '180px',
          format: value => {
            return this.formatTimestamp(value)
          },
          type: 'number'
        },
        {
          name: 'amount',
          label: this.$t('AMOUNTS') + '(' + this.$t('FEES') + ')',
          field: 'amount',
          filter: true,
          classes: 'text-right',
          // sortable: true,
          type: 'number',
          width: '100px'
        },
        {
          name: 'message',
          label: this.$t('REMARK'),
          field: 'message',
          filter: true,
          // sortable: true,
          type: 'string',
          width: '120px'
        }
      ],
      filter: '',
      visibleColumns: [
        'opt',
        'id',
        'type',
        'senderId',
        'recipientId',
        'timestamp',
        'amount',
        'message'
      ],
      row: null,
      modalInfoShow: false
    }
  },
  methods: {
    ...mapActions(['getTransactions']),
    info(message) {
      this.$q.notify({
        type: 'positive',
        color: 'positive',
        timeout: 2000,
        message
      })
    },
    getAmountNFee(data) {
      const { amount, fee } = data
      return `${convertFee(amount)}(${convertFee(fee)})`
    },
    async request(props) {
      await this.getTrans(props.pagination, props.filter)
    },
    async getTrans(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let condition = {
        // TODO 参数 bug
        // senderId: this.userInfo.account.address,
        // orderBy: 't_timestamp:desc',
        limit: limit,
        offset: (pageNo - 1) * limit
      }
      if (this.currency) {
        condition.currency = this.currency
      }
      let res = await this.getTransactions(condition)
      this.trans = res.transactions
      // set max
      this.pagination.rowsNumber = res.count
      this.loading = false
      return res
    },
    formatTimestamp(timestamp) {
      return fullTimestamp(timestamp)
    },
    getDataInfo(props) {
      let { row } = props
      this.row = row
      this.modalInfoShow = true
    },
    async getAccountInfo(address) {
      this.$root.$emit('openAccountModal', address)
    },
    matchSelf(address) {
      return this.address === address
    },
    resetTable() {
      this.pageNo = 1
    },
    getTransType(val) {
      return this.$t(transTypes[val])
    }
  },
  mounted() {
    this.getTrans()
  },
  watch: {
    userInfo(val) {
      this.getTrans()
    }
  }
}
</script>
<style lang="stylus" scoped>
.trans-table {
  margin-top: 3%;
}
</style>