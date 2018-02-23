<template>
  <div class="tab-panel-container row ">
    <transition 
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut" 
     mode="out-in">
      <div v-if="balancesData" class="col-12 shadow-1">
        <q-table :data="balancesData.balances" :config="tableConf" :columns="columns" @refresh="refresh" @rowclick="rowClick">
          
          

          <template slot="col-opt" slot-scope="cell">
              <router-link :to="getTransferParams(cell)" >
                          {{$t('TRANSFER')}}
              </router-link>
          </template>

          <template slot="col-allowWriteoff" slot-scope="cell">
            {{getAssetRule(cell.row)}}
          </template>


        </q-table>
        <q-pagination v-model="pageNo" :max="maxPage" />
        <q-inner-loading :visible="loading" />
      </div>
      </transition>
    </div>
</template>

<script>
import { api } from '../utils/api'

export default {
  props: ['userObj'],
  components: {},
  data() {
    return {
      balancesData: null,
      pageNo: 1,
      limit: 20,
      maxPage: 0,
      loading: false,
      tableConf: {
        title: this.$t('ASSET_PROFILE'),
        refresh: true,
        noHeader: false,
        columnPicker: true,
        leftStickyColumns: 0,
        rightStickyColumns: 1,
        bodyStyle: {
          maxHeight: '700px'
        },
        rowHeight: '35px',
        responsive: false
        // pagination: {
        //   rowsPerPage: 15,
        //   options: [5, 10, 15, 30, 50, 500]
        // }
        // selection: 'multiple'
      },
      columns: [
        {
          label: this.$t('ASSET_NAME'),
          field: 'currency',
          width: '100px',
          type: 'string',
          filter: true
        },
        {
          label: this.$t('BALANCE'),
          field: 'balanceShow',
          width: '150px',
          sort: true,
          filter: true
        },
        {
          label: this.$t('MAXIMUM'),
          field: 'maximumShow',
          width: '250px',
          sort: true,
          filter: true
        },
        {
          label: this.$t('PRECISION'),
          field: 'precision',
          classes: 'text-center',
          type: 'number',
          width: '80px',
          sort: true
        },
        {
          label: this.$t('QUANTITY'),
          field: 'quantityShow',
          width: '150px',
          filter: true,
          sort: true
        },
        {
          label: this.$t('CANCELLATION'),
          field: 'writeoff',
          classes: 'text-center',
          width: '80px',
          format: val => {
            return val === 0 ? 'normal' : 'writeoff'
          }
        },
        {
          label: this.$t('ALLOW_WWB'),
          field: 'allowWriteoff',
          classes: 'text-center',
          width: '200px'
        },
        {
          label: this.$t('OPERATION'),
          field: 'opt',
          classes: 'text-left',
          width: '50px'
        }
      ]
    }
  },
  methods: {
    async refresh(done) {
      this.resetTable()
      await this.getBalances()
      done()
    },
    async getBalances() {
      this.loading = true
      let limit = this.limit
      let pageNo = this.pageNo
      let res = await api.myBalances({
        address: this.user.account.address,
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      this.balancesData = res
      // set max
      this.maxPage = Math.ceil(res.count / limit)
      this.loading = false
      return res
    },
    rowClick(row) {
      const assetNameStr = this.$t('ASSET_NAME')
      const balanceStr = this.$t('BALANCE')
      const maximumStr = this.$t('MAXIMUM')
      const precisionStr = this.$t('PRECISION')
      const quantityStr = this.$t('QUANTITY')
      const writeoffStr = this.$t('CANCELLATION')
      const ruleStr = this.$t('ALLOW_WWB')
      let tableStr = `<table class="q-table horizontal-separator highlight loose "><tbody>
    <tr id='detail-addr' :v-clipboard="address" @success="info('copy success...')">
      <td >${assetNameStr}</td>
      <td >${row.currency}</td>
    </tr>
    <tr id='detail-pub' :v-clipboard="publicKey" @success="info('copy success...')">
      <td >${balanceStr}</td>
      <td >${row.balanceShow}</td>
    </tr>
    <tr id='detail-amount' :v-clipboard="balance" @success="info('copy success...')">
      <td >${maximumStr}</td>
      <td >${row.maximumShow}</td>
    </tr>
    <tr id='detail-amount' :v-clipboard="balance" @success="info('copy success...')">
      <td >${precisionStr}</td>
      <td >${row.precision}</td>
    </tr>
    <tr id='detail-amount' :v-clipboard="balance" @success="info('copy success...')">
      <td >${quantityStr}</td>
      <td >${row.quantityShow}</td>
    </tr>
    <tr id='detail-amount' :v-clipboard="balance" @success="info('copy success...')">
      <td >${writeoffStr}</td>
      <td >${row.allowWriteoff === 0 ? 'normal' : 'writeoff'}</td>
      
    </tr>
    <tr id='detail-amount' :v-clipboard="balance" @success="info('copy success...')">
      <td >${ruleStr}</td>
      <td >${this.getAssetRule(row)}</td>
    </tr>
    <tbody></table>
    `
      this.$q.dialog({
        title: this.$t('ACCOUNT_DETAIL'),
        message: tableStr
        // form: {
        //   address: {
        //     type: 'text',
        //     label: addressStr,
        //     disable: true,
        //     model: address
        //   },
        //   publicKey: {
        //     type: 'text',
        //     label: publicKeyStr,
        //     model: publicKey
        //   },
        //   amount: {
        //     type: 'text',
        //     label: balanceStr,
        //     model: balance
        //   }
        // }
      })
    },
    getTransferParams(cell) {
      return { name: 'transfer', params: { user: this.user, data: cell } }
    },
    getAssetRule(cell) {
      return `${cell.allowWriteoff === 0 ? 'Y' : 'N'}/${cell.allowWhitelist === 0 ? 'Y' : 'N'}/${
        cell.allowBlacklist === 0 ? 'Y' : 'N'
      }`
    }
  },
  async mounted() {
    if (this.user) {
      this.getBalances()
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
        this.getBalances()
      }
    },
    pageNo(val) {
      this.getBalances()
    }
  }
}
</script>

<style lang="stylus">
pd-5 {
  padding: 5%;
}
</style>
