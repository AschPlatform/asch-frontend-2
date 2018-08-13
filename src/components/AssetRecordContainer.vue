<template>
  <div>
    <record-table :data="trans" :options="toggleBtn" :maxPage="maxPage" @changePage="changePage" @changeType="changeType" :title="computedTitle" :clip="{col1: false, col2: true}" class="table"></record-table>
  </div>
</template>

<script>
import { fullTimestamp, convertFee } from '../utils/asch'
import { QBtn, QTable, QTd, QTableColumns, QTooltip, QBtnToggle } from 'quasar'
import { transTypes } from '../utils/constants'
import { mapActions, mapGetters } from 'vuex'
import RecordTable from '../components/RecordTable'

export default {
  name: 'AssetRecordContainer',
  props: ['currency', 'isCross'],
  components: {
    QBtn,
    QTable,
    QTd,
    QTableColumns,
    QTooltip,
    QBtnToggle,
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
      type: 1
    }
  },
  methods: {
    ...mapActions(['getTransfers', 'getMyCurrencyDeposits', 'getMyCurrencyWithdrawals']),
    info(message) {
      this.$q.notify({
        type: 'positive',
        color: 'positive',
        timeout: 2000,
        message
      })
    },
    getAmountNFee(data) {
      const { amount } = data
      return convertFee(amount)
    },
    async request(props) {
      await this.getTrans(props.pagination, props.filter)
    },
    async getTrans(pagination = {}, filter = '') {
      // TODO
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let condition = {
        // TODO 参数 bug
        ownerId: this.userInfo.account.address,
        orderBy: 'timestamp:desc',
        limit: limit,
        offset: (pageNo - 1) * limit
      }
      if (this.currency) {
        condition.currency = this.currency
      } else {
        if (this.isCross) {
          this.loading = false
          return false
        }
      }
      let res
      if (this.type === 1) {
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
          } else {
            plag = '-'
            e.recipientName ? temp.col1.push(e.recipientName) : temp.col1.push(e.recipientId)
          }
          temp.col1.push(fullTimestamp(e.timestamp))
          temp.col2.push(e.transaction.message || this.$t('NO_REMARK'))
          temp.col2.push(this.$t('REMARK'))
          temp.fee.push(plag + convertFee(e.amount, e.asset ? e.asset.precision : 8))
          temp.fee.push(e.currency)
          temp.iconKey = e.currency
          temp.tid = e.tid
          temp.needClip = true
          items.push(temp)
        })
        this.trans = items
      } else if (this.type === 2) {
        condition = {
          address: this.userInfo.account.address,
          currency: this.currency
        }
        res = await this.getMyCurrencyDeposits(condition)
        if (res.success && res.deposits) {
          let items = []
          res.deposits.forEach(e => {
            let temp = {
              col1: [],
              col2: [],
              fee: []
            }
            temp.col1.push(e.address)
            temp.col1.push(this.filterState(e.processed) + '  ' + fullTimestamp(e.timestamp))
            temp.col2.push(String(e.confirmations))
            temp.col2.push(this.$t('CONFIRMATIONS'))
            temp.fee.push(convertFee(e.amount, e.asset.precision))
            temp.fee.push(e.currency)
            temp.iconKey = e.currency
            temp.tid = e.tid
            temp.needClip = true
            items.push(temp)
          })
          this.trans = items
        } else {
          this.trans = []
        }
      } else if (this.type === 3) {
        condition = {
          address: this.userInfo.account.address,
          currency: this.currency
        }
        res = await this.getMyCurrencyWithdrawals(condition)
        if (res.success && res.withdrawals) {
          let items = []
          res.withdrawals.forEach(e => {
            let temp = {
              col1: [],
              col2: [],
              fee: []
            }
            temp.col1.push(e.recipientId)
            temp.col1.push(this.filterState(e.ready) + '  ' + fullTimestamp(e.timestamp))
            temp.col2.push(String(e.signs))
            temp.col2.push(this.$t('CONFIRMATIONS'))
            temp.fee.push(convertFee(e.amount, e.asset.precision))
            temp.fee.push(e.currency)
            temp.iconKey = e.currency
            temp.tid = e.tid
            temp.needClip = true
            items.push(temp)
          })
          this.trans = items
        } else {
          this.trans = []
        }
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
      this.maxPage = 1
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
    changePage(num) {
      this.pagination.page = num
      this.getTrans()
    },
    changeType(num) {
      this.type = num
    },
    filterState(num) {
      if (num === 0) {
        return this.$t('PROCESS')
      }
      return this.$t('DONE')
    }
  },
  mounted() {
    if (this.userInfo) this.getTrans()
  },
  computed: {
    ...mapGetters(['userInfo']),
    dynamicCol() {
      if (this.type === 1) {
        return [
          {
            name: 'opt',
            label: this.$t('OPERATION'),
            field: 'opt',
            align: 'center'
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
            label: this.$t('AMOUNTS'),
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
        ]
      } else if (this.type === 2) {
        // CROSS
        return [
          {
            name: 'crossAmount',
            label: this.$t('AMOUNTS'),
            field: 'amount',
            align: 'center'
          },
          {
            name: 'confirmations',
            label: this.$t('CONFIRMATIONS'),
            field: 'confirmations',
            align: 'center'
          },
          {
            name: 'processed',
            label: this.$t('PROCESSED'),
            field: 'processed',
            align: 'center',
            format: value => {
              return value === 1 ? this.$t('DONE') : this.$t('PROCESS')
            }
          },
          {
            name: 'timestamp',
            label: this.$t('DATE'),
            field: 'timestamp',
            format: value => {
              return this.formatTimestamp(value)
            }
          }
        ]
      } else {
        return [
          {
            name: 'crossAmount',
            label: this.$t('AMOUNTS'),
            field: 'amount',
            align: 'center'
          },
          {
            name: 'address',
            label: this.$t('ADDRESS'),
            field: 'recipientId',
            align: 'center'
          },
          {
            name: 'signs',
            label: this.$t('CONFIRMATIONS'),
            field: 'signs',
            align: 'center'
          },
          {
            name: 'ready',
            label: this.$t('PROCESSED'),
            field: 'ready',
            align: 'center',
            format: value => {
              return value === 1 ? this.$t('DONE') : this.$t('PROCESS')
            }
          },
          {
            name: 'timestamp',
            label: this.$t('DATE'),
            field: 'timestamp',
            format: value => {
              return this.formatTimestamp(value)
            }
          }
        ]
      }
    },
    tableTitle() {
      const t = this.$t
      let str
      switch (this.type) {
        case 1:
          str = t('DAPP_TRANSACTION_RECORD_LATELY')
          break
        case 2:
          str = t('DEPOSIT_RECORD')
          break
        case 3:
          str = t('WITHDRAW_RECORD')
          break
      }
      return str
    },
    toggleBtn() {
      if (this.isCross) {
        return [
          {
            label: this.$t('DAPP_TRANSACTION_RECORD_LATELY'),
            value: 1
          },
          {
            label: this.$t('DEPOSIT_RECORD'),
            value: 2
          },
          {
            label: this.$t('WITHDRAW_RECORD'),
            value: 3
          }
        ]
      }
      return 'none'
    },
    computedTitle() {
      switch (this.type) {
        case 1:
          return this.$t('DAPP_TRANSACTION_RECORD_LATELY')
        case 2:
          return this.$t('DEPOSIT_RECORD')
        case 3:
          return this.$t('WITHDRAW_RECORD')
      }
    }
  },
  watch: {
    currency(val) {
      this.getTrans()
    },
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
</style>