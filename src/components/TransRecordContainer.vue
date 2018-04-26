<template>
  <div>
    <q-table class="home-table-container" :data="trans" :columns="dynamicCol" row-key="id" :pagination.sync="pagination" @request="request" :loading="loading" :filter="filter" :title="tableTitle">
      <template slot="top-right" slot-scope="props">
        <q-btn-toggle class="bg-secondary text-white" flat rounded icon="fiber_manual_record" v-model="type" 
    toggle-color="negative"  toggle-text-color="white"
    :options="[
      {label: $t('TRS_TYPE_TRANSFER_RECORD'), value: 2},
      {label: $t('DAPP_TRANSACTION_RECORD'), value: 1},]" />
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
import { QTable, QTd, QTableColumns, QTooltip, QBtnToggle, QPopover } from 'quasar'
import { transTypes } from '../utils/constants'
import { mapActions } from 'vuex'

export default {
  name: 'TransTableContainer',
  props: ['userInfo', 'currency'],
  components: {
    QTable,
    QTd,
    QTableColumns,
    QTooltip,
    QBtnToggle,
    QPopover
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
        senderId: this.userInfo.account.address,
        orderBy: 'timestamp:desc',
        limit: limit,
        offset: (pageNo - 1) * limit
      }
      if (this.currency) {
        condition.currency = this.currency
      }
      let res
      if (this.type === 1) {
        res = await this.getTransactions(condition)
        this.trans = res.transactions
      } else {
        condition.ownerId = condition.senderId
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
          // {
          //   name: 'opt',
          //   label: this.$t('OPERATION'),
          //   field: 'opt',
          //   align: 'center'
          // },
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

.home-table-container {
  min-height: 500px;
}

.q-table-title {
  font-weight: 600 !important;
}
</style>