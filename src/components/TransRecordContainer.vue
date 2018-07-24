<template>
  <div>
    <record-table :data="trans" :options="toggleBtn" :maxPage="maxPage" @changePage="changePage" @changeType="changeType" :title="computedTitle" class="table"></record-table>
  </div>
</template>

<script>
import { fullTimestamp, convertFee } from '../utils/asch'
import { QTable, QTd, QTableColumns, QTooltip, QBtnToggle, QPopover, QChip } from 'quasar'
import { transTypes } from '../utils/constants'
import { mapActions } from 'vuex'
import RecordTable from '../components/RecordTable'

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
    QChip,
    RecordTable
  },
  data() {
    return {
      trans: [],
      loading: false,
      maxPage: 1,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },

      filter: '',
      row: null,
      modalInfoShow: false,
      type: 1,
      toggleBtn: [
        {
          label: this.$t('TRS_TYPE_TRANSFER_RECORD'),
          value: 1
        },
        {
          label: this.$t('DAPP_TRANSACTION_RECORD'),
          value: 2
        }
      ]
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
        orderBy: 'timestamp:desc',
        limit: limit,
        offset: (pageNo - 1) * limit
      }
      if (this.currency) {
        condition.currency = this.currency
      }
      let res
      if (this.type === 2) {
        condition.senderId = this.userInfo.account.address
        res = await this.getTransactions(condition)
        this.trans = res.transactions
        let temps = []
        res.transactions.forEach(e => {
          let temp = {
            col1: [],
            col2: [],
            fee: []
          }
          temp.col1.push(this.getTransType(e.type))
          temp.col1.push(fullTimestamp(e.timestamp))
          temp.col2.push(this.dueArg(e.args))
          temp.col2.push(this.$t('ARGS'))
          temp.fee.push('-' + convertFee(e.fee))
          temp.fee.push('XAS')
          temp.iconKey = 'FEE'
          temps.push(temp)
        })
        this.trans = temps
      } else {
        condition.ownerId = this.userInfo.account.address
        res = await this.getTransfers(condition)
        let items = []
        res.transfers.forEach(e => {
          let temp = {
            col1: [],
            col2: [],
            fee: []
          }
          let plag = ''
          if (e.recipientId === this.userInfo.address) {
            plag = '+'
            temp.col1.push(e.senderId)
            temp.iconKey = 'RECEIPT'
          } else {
            plag = '-'
            e.recipientName ? temp.col1.push(e.recipientName) : temp.col1.push(e.recipientId)
            temp.iconKey = 'PAY'
          }
          temp.col1.push(fullTimestamp(e.timestamp))
          temp.col2.push(e.transaction.message || this.$t('NO_REMARK'))
          temp.col2.push(this.$t('REMARK'))
          temp.fee.push(plag + convertFee(e.amount, e.asset ? e.asset.precision : 8))
          temp.fee.push(e.currency)
          items.push(temp)
        })
        this.trans = items
      }

      // set max
      this.pagination.rowsNumber = res.count
      this.maxPage = Math.ceil(this.pagination.rowsNumber / this.pagination.rowsPerPage)
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
      this.maxPage = 1
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
      let content = JSON.parse(args)
      if (content.length !== 0) {
        let str = content.join(' , ')
        return str
      }
      return this.$t('NO_ARGS')
    },
    changePage(num) {
      this.pagination.page = num
      this.getTrans()
    },
    changeType(num) {
      this.type = num
    }
  },
  mounted() {
    this.getTrans()
  },
  computed: {
    dynamicCol() {
      if (this.type === 1) {
        return [
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
    },
    computedTitle() {
      return this.type === 2 ? this.toggleBtn[1].label : this.toggleBtn[0].label
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

.table {
  height 100%
}
</style>