<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div v-if="user" class="layout-padding">
    <div class="row col-12 ">
      <q-card class="col" color="secondary">
        <q-card-title>
          {{$t('BALANCE')}}
        </q-card-title>
        <q-card-main class="row">
          <big>
                      {{user.account.balance | fee}} XAS
                    </big>
          <div class='col'>
            <q-btn id='addr-data' :data-clipboard-text="user.account.address" flat>
              {{user.account.address}}
            </q-btn>
          </div>
        </q-card-main>
  
      </q-card>
      <q-card class="col" color="secondary">
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
      <q-card class="col " color="secondary">
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
    <div class="row col-12 ">
      <q-card v-if="transData" class="col-12">
        <q-data-table :data="transData.transactions" :config="tableConf" :columns="columns" @refresh="refresh" @rowclick="rowClick">
        <template slot="col-id" slot-scope="cell">
        <div class="my-label text-grey-8">
          {{cell.data}}
          <q-tooltip>{{cell.data}}</q-tooltip>
        </div>
      </template>
      <template slot="col-message" slot-scope="cell">
        {{cell.data}}
        <q-popover v-if="cell.data"  ref="popover-msg">
        <div class="light-paragraph">{{cell.data}}</div>
        </q-popover >
      </template>

      <template slot="col-fee" slot-scope="cell">
        {{getAmountNFee(cell)}}
      </template>

      <template slot="col-senderId" class="table-address" slot-scope="cell">
        <a @click="getAccountInfo(cell.data)">
          {{matchSelf(cell.data)?'Me':cell.data}}
        </a>
        <q-tooltip v-if="!matchSelf(cell.data)">{{cell.data}}</q-tooltip>
      </template>

      <template slot="col-recipientId" slot-scope="cell">
        <div v-if="cell.data">
          <a  @click="getAccountInfo(cell.data)">
            {{matchSelf(cell.data)?'Me':cell.data}}
          </a>
          <q-tooltip v-if="!matchSelf(cell.data)" ref="popover-rec">
            {{cell.data}}
          </q-tooltip >
        </div>
        <div v-else >SYSTEM</div>
      </template>


      </q-data-table>
    </q-card>
    </div>
    
  </div>
</template>

<script>
import {
  QCard,
  QCardMain,
  QCardSeparator,
  QIcon,
  QCardTitle,
  QBtn,
  Toast,
  QDataTable,
  QTooltip,
  QPopover,
  Dialog
} from 'quasar'
import { api } from '../utils/api'
import { transTypes } from '../utils/constants'
import Clipboard from 'clipboard'
import { fullTimestamp, convertFee } from '../utils/asch'

export default {
  props: ['userObj'],
  components: {
    QCard,
    QIcon,
    QCardSeparator,
    QCardMain,
    QCardTitle,
    QBtn,
    Toast,
    QDataTable,
    QTooltip,
    QPopover,
    Dialog
  },
  data() {
    return {
      transData: null,
      tableConf: {
        title: this.$t('MY_TRSACTIONS'),
        refresh: true,
        noHeader: false,
        columnPicker: true,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        bodyStyle: {
          maxHeight: '700px'
        },
        rowHeight: '35px',
        responsive: false,
        pagination: {
          rowsPerPage: 15,
          options: [5, 10, 15, 30, 50, 500]
        }
        // selection: 'multiple'
      },
      columns: [
        {
          label: 'ID',
          field: 'id',
          width: '100px'
        },
        {
          label: this.$t('TYPE'),
          field: 'type',
          width: '70px',
          filter: true,
          format: value => {
            return this.$t(transTypes[value])
          }
        },
        {
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
          label: this.$t('RECIPIENT'),
          field: 'recipientId',
          classes: 'text-center',
          format: value => {
            if (value === '') {
              return '<a class="material-icons text-primary" >SYSTEM</a>'
            }
            let isMySelf = this.matchSelf(value)
            return isMySelf ? 'Me' : value
          },
          width: '100px'
        },
        {
          label: this.$t('DATE'),
          field: 'timestamp',
          width: '180px',
          format: value => {
            return this.formatTimestamp(value)
          },
          sort: true,
          type: 'number'
        },
        {
          label: this.$t('AMOUNTS') + '(' + this.$t('FEES') + ')',
          field: 'fee',
          filter: true,
          classes: 'text-right',
          sort: true,
          type: 'number',
          width: '100px'
        },
        {
          label: this.$t('REMARK'),
          field: 'message',
          filter: true,
          sort: true,
          type: 'string',
          width: '120px'
        }
      ]
    }
  },
  methods: {
    async refresh(done) {
      // let trans = await this.getTrans()
      // this.transRecord = trans
      done()
    },
    formatTimestamp(timestamp) {
      return fullTimestamp(timestamp)
    },
    rowClick() {},
    async getAccountInfo(address) {
      let res = await api.account({
        address: address
      })
      let { publicKey, balance } = res.account
      Dialog.create({
        title: this.$t('ACCOUNT_DETAIL'),
        form: {
          address: {
            type: 'text',
            label: this.$t('ADDRESS'),
            disable: true,
            model: address
          },
          publicKey: {
            type: 'text',
            label: this.$t('PUBLIC_KEY'),
            model: publicKey
          },
          amount: {
            type: 'text',
            label: this.$t('BALANCE'),
            model: convertFee(balance)
          }
        }
      })
    },
    info(key) {
      Toast.create.info(key)
    },
    // get transactions
    async getTrans() {
      let count = this.tableConf.pagination.rowsPerPage
      let res = await api.transactions({
        recipientId: this.user.account.address,
        senderPublicKey: this.user.account.publicKey,
        orderBy: 't_timestamp:desc',
        limit: count,
        offset: 0 * count
      })
      this.transData = res
      return res
    },
    getAmountNFee(data) {
      const { amount, fee } = data.row
      return `${convertFee(amount)}(${convertFee(fee)})`
    },
    matchSelf(address) {
      return this.user.account.address === address
    },
    resetTable() {}
  },
  async mounted() {
    let clipboard = new Clipboard('#addr-data')
    clipboard.on('success', e => {
      this.info('copy success...')
    })
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

<style>

</style>
