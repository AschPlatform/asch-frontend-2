<template>
  <div>
    <q-table :data="trans" :columns="dynamicCol" row-key="id" :pagination.sync="pagination" @request="request" :loading="loading" :filter="filter" :title="tableTitle">
      <template slot="top-right" slot-scope="props">
        <q-btn-toggle v-if="isCross" v-model="type" outline
    toggle-color="secondary"
    :options="[
      {label: $t('DAPP_TRANSACTION_RECORD'), value: 1},
      {label: $t('DEPOSIT')+$t('RECORD'), value: 2},
      {label: $t('WITHDRAW')+$t('RECORD'), value: 3}
    ]" />
        <!-- <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" /> -->
</template>

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
      {{props.value}}
      <q-popover v-if="props.value" ref="popover-msg">
        <div class="light-paragraph">{{props.value}}</div>
      </q-popover>
    </q-td>

    <q-td slot="body-cell-amount" slot-scope="props" :props="props">
      {{getAmountNFee(props.row)}}
    </q-td>

    <q-td slot="body-cell-crossAmount" slot-scope="props" :props="props">
      {{props.value | fee(props.row.percision)}}
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
</div>
</template>

<script>
import { fullTimestamp, convertFee } from '../utils/asch'
import { QBtn, QTable, QTd, QTableColumns, QTooltip, QBtnToggle } from 'quasar'
import { transTypes } from '../utils/constants'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AssetRecordContainer',
  props: ['currency', 'isCross'],
  components: {
    QBtn,
    QTable,
    QTd,
    QTableColumns,
    QTooltip,
    QBtnToggle
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
        this.trans = res.transfers
      } else if (this.type === 2) {
        condition = {
          address: this.userInfo.account.address,
          currency: this.currency
        }
        res = await this.getMyCurrencyDeposits(condition)
        if (res.success && res.deposits) {
          this.trans = res.deposits
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
          this.trans = res.withdrawals
        } else {
          this.trans = []
        }
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
          // {
          //   name: 'id',
          //   label: 'ID',
          //   field: 'id'
          // },
          // {
          //   name: 'type',
          //   label: this.$t('TYPE'),
          //   field: 'type',
          //   align: 'center',
          //   filter: true,
          //   format: value => {
          //     return this.getTransType(value)
          //   }
          // },
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
            name: 't_timestamp',
            label: this.$t('DATE'),
            field: 't_timestamp',
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
            name: 'processed',
            label: this.$t('PROCESSED'),
            field: 'processed',
            align: 'center',
            format: value => {
              return value === 1 ? this.$t('DONE') : this.$t('PROCESS')
            }
          },
          {
            name: 't_timestamp',
            label: this.$t('DATE'),
            field: 't_timestamp',
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
          str = t('DAPP_TRANSACTION_RECORD')
          break
        case 2:
          str = t('DEPOSIT_RECORD')
          break
        case 3:
          str = t('WITHDRAW_RECORD')
          break
      }
      return str
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