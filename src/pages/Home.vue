<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div v-if="user" class="layout-padding self-center">
    <div class="row gutter-xs">
      <div class="col-auto ">
        <q-card class="card-info" color="secondary ">
          <q-card-title>
            {{$t('BALANCE')}}
            <!-- add balance refresh -->
            <div slot="right" class="row items-center">
              <q-btn :loading="refreshLoading" flat round icon="refresh" @click="refreshBalance" />
            </div>
          </q-card-title>
          <q-card-main class="column ">
            <big>
                                      {{user.account.balance | fee}} XAS
                                    </big>
  
            <q-btn id='addr-data' v-clipboard="user.account.address" @success="info('copy success...')" flat>
              {{user.account.address}}
            </q-btn>
          </q-card-main>
  
        </q-card>
      </div>
      <div class="col">
        <q-card class="card-info" color="secondary">
          <q-card-title>
            {{$t('LATEST_BLOCK_HEIGHT')}}
            <span slot="subtitle">{{user.latestBlock.timestamp | time}}</span>
          </q-card-title>
          <q-card-main>
            <big>
                                    {{user.latestBlock.height}}
                                    </big>
            <p class="text-faded"></p>
  
          </q-card-main>
        </q-card>
      </div>
      <div class="col">
        <q-card class="card-info" color="secondary">
          <q-card-title>
            {{$t('VERSION_INFO')}}
            <span slot="subtitle">{{user.version.build}}</span>
          </q-card-title>
          <q-card-main>
            <big>
                            {{user.version.version}}
                          </big>
          </q-card-main>
        </q-card>
      </div>
    </div>
  
    <div class="row col shadow-1 trans-table">
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <div v-if="transData" class="col-12">
          <q-table :data="transData.transactions" :columns="columns" row-key="id" :pagination.sync="pagination" @request="request" :loading="loading" :filter="filter" :visible-columns="visibleColumns" :title="$t('DAPP_TRANSACTION_RECORD')">
  
            <!--  <template slot="top-left" slot-scope="props">
              <q-search
                hide-underline
                color="secondary"
                v-model="filter"
                class="col-8"
              />
</template>-->

<template slot="top-right" slot-scope="props">
  <q-table-columns color="secondary" class="q-mr-sm" v-model="visibleColumns" :columns="columns" />
  <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
</template>

            <q-td slot="body-cell-id" slot-scope="props" :props="props">
              <div class="my-label text-grey-8" @click="getDataInfo(props)">
                {{props.value.substring(0,7)}}
                <q-tooltip>{{props.value}}</q-tooltip>
              </div>
            </q-td>
  
            <q-td slot="body-cell-message" slot-scope="props" :props="props">
              {{props.value}}
              <q-popover v-if="props.value" ref="popover-msg">
                <div class="light-paragraph">{{props.value}}</div>
              </q-popover>
            </q-td>
  
            <q-td slot="body-cell-amount" slot-scope="props" :props="props">
              {{getAmountNFee(props)}}
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
      </transition>
    </div>
    <q-modal minimized  v-model="modalShow" content-css="padding: 20px">
      <big>{{$t('ACCOUNT_DETAIL')}}</big>
      <table v-if="modalShow" class="q-table horizontal-separator highlight loose ">
        <tbody class='info-tbody'>
          <tr id='detail-addr' v-clipboard="accountInfo.address" @success="info('copy address success...')">
            <td >{{$t('ADDRESS')}}</td>
            <td >{{accountInfo.address}}</td>
          </tr>
          <tr id='detail-pub' v-clipboard="accountInfo.publicKey" @success="info('copy publicKey success...')">
            <td >{{$t('PUBLIC_KEY')}}</td>
            <td >{{accountInfo.publicKey}}</td>
          </tr>
          <tr id='detail-amount' v-clipboard="accountInfo.balance" @success="info('copy balance success...')">
            <td >{{$t('BALANCE')}}</td>
            <td >{{accountInfo.balance}}</td>
          </tr>
        </tbody>
      </table>
      <br/>
      <q-btn
        color="primary"
        @click="()=>{this.modalShow = false; this.accountInfo = {}}"
        label="Close"
      />
    </q-modal>
  </div>
</template>

<script>
import { api } from '../utils/api'
import { transTypes } from '../utils/constants'
import { fullTimestamp, convertFee } from '../utils/asch'

export default {
  props: ['userObj'],
  components: {},
  data() {
    return {
      transData: null,
      loading: false,
      refreshLoading: false,
      modalShow: false,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      columns: [
        {
          name: 'id',
          label: 'ID',
          field: 'id',
          width: '100px'
        },
        {
          name: 'type',
          label: this.$t('TYPE'),
          field: 'type',
          width: '70px',
          filter: true,
          format: value => {
            return this.$t(transTypes[value])
          }
        },
        {
          name: 'senderId',
          label: this.$t('SENDER'),
          field: 'senderId',
          classes: 'text-center',
          format: value => {
            let isMySelf = this.matchSelf(value)
            return isMySelf ? 'Me' : value
          },
          width: '100px'
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
          },
          width: '100px'
        },
        {
          name: 'timestamp',
          label: this.$t('DATE'),
          field: 'timestamp',
          width: '180px',
          format: value => {
            return this.formatTimestamp(value)
          },
          // sortable: true,
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
      visibleColumns: ['id', 'type', 'senderId', 'recipientId', 'timestamp', 'amount', 'message'],
      accountInfo: {
        address: '',
        publicKey: '',
        balance: ''
      }
    }
  },
  methods: {
    async request(props) {
      await this.getTrans(props.pagination, props.filter)
    },
    refreshBalance(e, done) {
      this.refreshLoading = true
      this.$root.$emit('refreshAccount', () => (this.refreshLoading = false))
    },
    formatTimestamp(timestamp) {
      return fullTimestamp(timestamp)
    },
    getDataInfo(props) {
      console.log(props)
    },
    async getAccountInfo(address) {
      if (!address) return
      let res = await api.account({
        address: address
      })

      let { publicKey, balance } = res.account
      balance = convertFee(balance)
      this.accountInfo = {
        publicKey,
        balance,
        address
      }

      this.modalShow = true
    },
    info(message) {
      this.$q.notify({
        type: 'positive',
        color: 'positive',
        timeout: 2000,
        message
      })
    },
    // get transactions
    async getTrans(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await api.transactions({
        recipientId: this.user.account.address,
        senderPublicKey: this.user.account.publicKey,
        orderBy: 't_timestamp:desc',
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      this.transData = res
      // set max
      this.pagination.rowsNumber = res.count
      this.loading = false
      return res
    },
    getAmountNFee(data) {
      const { amount, fee } = data.row
      return `${convertFee(amount)}(${convertFee(fee)})`
    },
    matchSelf(address) {
      return this.user.account.address === address
    },
    resetTable() {
      this.pageNo = 1
    }
  },
  mounted() {
    if (this.user) {
      this.getTrans()
    }
  },
  computed: {
    user() {
      return this.userObj
    }
  },
  watch: {
    userObj(val) {
      if (val) {
        this.getTrans()
      }
    }
  }
}
</script>

<style lang="stylus">
.trans-table {
  margin-top: 3%;
}

.card-info {
  height: 150px;
}

.info-tbody {
  tr {
    cursor: text;
  }
}
</style>
