<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div v-if="user" class="layout-padding self-center">
    <div class="row gutter-xs col-12">
      <div class="col-12 col-auto  col-xs-12">
        <q-card>
          <q-card-main class="row">
            <div class="col-6">
              <jdenticon  :address="user.account.address" :size="60" />
            </div>
            <div  class="col-6">
              <q-btn size="xs" :label="$t('TRS_TYPE_TRANSFER')" flat   @click="$root.$emit('openTransactionDialog',{currency:'XAS',precision:8})" />
              <q-btn size="xs" :label="$t('RECEIVE')"  flat   @click="receive" />
            </div>
          </q-card-main>
        </q-card>
      </div>
    </div>
  
    <div class="row col shadow-1 trans-table">
      <div class="col-4">
        <q-card class="card-info" color="primary ">
          <q-card-title>
            {{$t('BALANCE')}}
          </q-card-title>
           <q-card-main >
             {{userInfo.account.balance | fee}}
             {{$t('MAIN_ASSET')+'XAS'}}
             <div>  
             {{address}}
              <q-btn v-clipboard="address" @success="info('copy senderId success...')" size="xs"  flat round icon="compare arrows" />
             </div>
             <div @click="showAddrQr">
               <vue-qr :text="address"></vue-qr>
             </div>
           </q-card-main>
          <q-card-main >
            <q-list highlight>
              <q-item v-for="(balance,idx) in  balances" :key="idx">
                <q-item-side>
                  <q-item-tile avatar>
                    <img :src="null">
                  </q-item-tile>
                </q-item-side>
                <q-item-main :label="balance.currency" />
                <q-item-side right>
                  <q-item-tile >
                    {{balance.balance | fee(balance.precision)}}
                  </q-item-tile>
                </q-item-side>
              </q-item>
            </q-list>
            <q-btn @click="assets" flat :label="$t('SEE_ALL_ASSETS')" icon="compare arrows" />
          </q-card-main>
        </q-card>
      </div>
        <div v-if="transData" class="col-8">
          <q-table :data="transData.transactions" 
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
        </div>
    </div>
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
import { api } from '../utils/api'
import { transTypes } from '../utils/constants'
import { fullTimestamp, convertFee } from '../utils/asch'
import Jdenticon from '../components/Jdenticon'
import VueQr from 'vue-qr'
import { mapGetters } from 'vuex'
import {
  QCard,
  QCardMain,
  QCardTitle,
  QModal,
  QTable,
  QTd,
  QBtn,
  QList,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile
} from 'quasar'

export default {
  props: ['userObj'],
  components: {
    VueQr,
    Jdenticon,
    QCard,
    QCardMain,
    QCardTitle,
    QModal,
    QTable,
    QTd,
    QBtn,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile
  },
  data() {
    return {
      transData: null,
      loading: false,
      refreshLoading: false,
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
      let { row } = props
      this.row = row
      this.modalInfoShow = true
    },
    async getAccountInfo(address) {
      this.$root('openAccountModal', address)
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
        recipientId: this.address,
        senderPublicKey: this.userInfo.publicKey,
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
      const { amount, fee } = data
      return `${convertFee(amount)}(${convertFee(fee)})`
    },
    matchSelf(address) {
      return this.address === address
    },
    resetTable() {
      this.pageNo = 1
    },
    getTransType(val) {
      return this.$t(transTypes[val])
    },
    assets() {
      this.$router.push('assets')
    },
    showAddrQr() {
      this.$root.$emit('showQRCodeModal', this.address)
    },
    receive() {}
  },
  mounted() {
    if (this.user) {
      this.getTrans()
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'balances']),
    user() {
      return this.userInfo
    },
    address() {
      return this.userInfo && this.userInfo.account ? this.userInfo.account.address : 'nothing'
    }
  },
  watch: {
    userInfo(val) {
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

.link-cursor {
  cursor: point;
}
</style>
