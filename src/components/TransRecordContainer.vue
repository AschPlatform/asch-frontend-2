<template>
  <div>
    <q-table hide-header separator="none" class="no-shadow trans-record-container" :data="trans" :columns="dynamicCol" row-key="id" :pagination.sync="pagination" @request="request" :loading="loading" :filter="filter" :title="tableTitle">
    <template slot="top-right" slot-scope="props">
        <q-btn-toggle :class="transRecordBtnClass" flat rounded icon="fiber_manual_record" v-model="type" 
    toggle-color="negative"  toggle-text-color="white"
    :options="[
      {label: $t('TRS_TYPE_TRANSFER_RECORD'), value: 2},
      {label: $t('DAPP_TRANSACTION_RECORD'), value: 1},]" />
        <!-- <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" /> -->
    </template>

    <q-td slot="body-cell-currency" slot-scope="props" :props="props">
      <q-chip small color="secondary">{{ props.value }}</q-chip>
    </q-td>

    <q-td slot="body-cell-id" slot-scope="props" :props="props">
      <div v-if="props.value" class="my-label" >
        {{props.value.substring(0,7)}}
        <q-tooltip>{{props.value}}</q-tooltip>
      </div>
    </q-td>

    <q-td slot="body-cell-opt"  slot-scope="props" :props="props">
      <q-btn @click="getDataInfo(props)" icon="remove red eye" size="sm" flat color="secondary" >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DAPP_DETAIL')}}</q-tooltip>
        </q-btn>
    </q-td>

    <q-td slot="body-cell-message" slot-scope="props" :props="props">
      {{showMemo(props.row)}}
      <q-popover v-if="props.row.transaction.message" ref="popover-msg">
        <div class="light-paragraph">{{props.row.transaction.message}}</div>
      </q-popover>
    </q-td>

    <q-td slot="body-cell-amount" slot-scope="props">
      {{getAmountNFee(props.row)}}
    </q-td>

    <q-td slot="body-cell-senderId" class="table-address" slot-scope="props" :props="props">
      <div >
        <a @click="getAccountInfo(props.row.senderId)">
              {{matchSelf(props.value)?'Me':props.value}}
            </a>
        <q-tooltip v-if="!matchSelf(props.value)">{{props.value}}</q-tooltip>
      </div>
    </q-td>

    <q-td slot="body-cell-recipientId" slot-scope="props" :props="props">
      <div v-if="props.value">
        <a @click="getAccountInfo(props.row.recipientId)">
                {{getName(props)}}
              </a>
        <q-tooltip v-if="!matchSelf(props.value)" ref="popover-rec">
          {{props.value}}
        </q-tooltip>
      </div>
      <div v-else>SYSTEM</div>
    </q-td>

    <q-td slot="body-cell-args" slot-scope="props" :props="props">
      {{props.value}}
      <q-popover  v-if="props.row" ref="popover-msg" style="max-width: 150px;">
        <!-- <pre class="light-paragraph">{{props.row.args}}</pre> -->
        <pre class="light-paragraph">{{dueArg(props.row.args)}}</pre>
      </q-popover>
    </q-td>
  </q-table>
  </div>
</template>

<script>
import { fullTimestamp, convertFee } from '../utils/asch'
import { QTable, QTd, QTableColumns, QTooltip, QBtnToggle, QPopover, QChip } from 'quasar'
import { transTypes } from '../utils/constants'
import { mapActions } from 'vuex'

export default {
  name: 'TransRecordContainer',
  props: ['userInfo', 'currency'],
  components: {
    QTable,
    QTd,
    QTableColumns,
    QTooltip,
    QBtnToggle,
    QPopover,
    QChip
  },
  data() {
    return {
      trans: [],
      loading: false,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },

      filter: '',
      row: null,
      modalInfoShow: false,
      type: 2
    }
  },
  methods: {
    ...mapActions(['getTransactions', 'getTransfers']),
    info(message) {
      this.$q.notify({
        type: 'positive',
        color: 'positive',
        timeout: 2000,
        message
      })
    },
    getAmountNFee(data) {
      const { amount, asset = {} } = data
      let precision = asset ? asset.precision : 8
      return convertFee(amount, precision)
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
        orderBy: 'timestamp:desc',
        limit: limit,
        offset: (pageNo - 1) * limit
      }
      if (this.currency) {
        condition.currency = this.currency
      }
      let res
      if (this.type === 1) {
        condition.senderId = this.userInfo.account.address
        res = await this.getTransactions(condition)
        this.trans = res.transactions
      } else {
        condition.ownerId = this.userInfo.account.address
        res = await this.getTransfers(condition)
        this.trans = res.transfers
      }

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
      this.$root.$emit('showTransInfoModal', row)
    },
    async getAccountInfo(address) {
      this.$root.$emit('openAccountModal', address)
    },
    matchSelf(address) {
      return this.userInfo.account.address === address
    },
    resetTable() {
      this.pageNo = 1
    },
    getTransType(val) {
      return this.$t(transTypes[val])
    },
    resetQuery() {
      this.pagination = {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      }
    },
    getName(props) {
      let flag = this.matchSelf(props.value)
      return flag ? 'Me' : props.row.recipientName ? props.row.recipientName : props.value
    },
    showMemo(o) {
      if (o.transaction.message) {
        if (o.transaction.message === '') {
          return ''
        }
        return o.transaction.message.slice(0, 7)
      }
    },
    dueArg(args) {
      args = args.replace(/,/g, '\n')
      args = args.replace(/"/g, '')
      args = args.replace(/\[/g, '')
      args = args.replace(/\]/g, '')
      return args
    }
  },
  mounted() {
    this.getTrans()
  },
  computed: {
    dynamicCol() {
      if (this.type === 1) {
        return [
          // {
          //   name: 'opt',
          //   label: this.$t('OPERATION'),
          //   field: 'opt',
          //   align: 'center'
          // },
          {
            name: 'id',
            label: 'ID',
            field: 'id'
          },
          {
            name: 'currency',
            label: 'ID',
            field: 'currency'
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
          // {
          //   name: 'senderId',
          //   label: this.$t('SENDER'),
          //   field: 'senderId',
          //   align: 'center',
          //   format: value => {
          //     let isMySelf = this.matchSelf(value)
          //     return isMySelf ? 'Me' : value
          //   }
          // },
          // {
          //   name: 'recipientId',
          //   label: this.$t('RECIPIENT'),
          //   field: 'recipientId',
          //   align: 'center',
          //   format: value => {
          //     if (value === '') {
          //       return 'SYSTEM'
          //     }
          //     let isMySelf = this.matchSelf(value)
          //     return isMySelf ? 'Me' : value
          //   }
          // },
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
            name: 'fee',
            label: this.$t('FEES'),
            field: 'fee',
            filter: true,
            format: value => {
              return convertFee(value)
            }
          },
          {
            name: 'args',
            label: this.$t('ARGS'),
            field: 'args',
            format: args => {
              if (args) {
                args = args.replace(/"/g, '')
                args = args.replace('[', '')
                args = args.replace(']', '')
                args = args.substr(0, 10) + '...'
              }
              return args
            },
            align: 'center'
          }
          // {
          //   name: 'message',
          //   label: this.$t('REMARK'),
          //   field: 'message',
          //   filter: true,
          //   // sortable: true,
          //   type: 'string',
          //   width: '120px'
          // }
        ]
      } else {
        return [
          {
            name: 'currency',
            label: this.$t('ASSET'),
            field: 'currency',
            filter: true,
            type: 'number'
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
            align: 'center'
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
            label: this.$t('AMOUNTS'),
            field: 'amount',
            filter: true,
            // sortable: true,
            type: 'number'
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
        ]
      }
    },
    transRecordBtnClass() {
      return this.isDesk ? 'bg-secondary text-white' : 'trans-record-btns bg-secondary text-white'
    },
    tableTitle() {
      const t = this.$t
      return this.type === 1
        ? t('DAPP_TRANSACTION_RECORD_LATELY')
        : t('TRS_TYPE_TRANSFER_RECORD_LATELY')
    }
  },
  watch: {
    userInfo(val) {
      this.getTrans()
    },
    type(val) {
      this.resetQuery()
      this.getTrans()
    }
  }
}
</script>

<style lang="stylus" scoped>
.trans-table {
  margin-top: 3%;
}

.q-table-title {
  font-weight: 600 !important;
}
</style>