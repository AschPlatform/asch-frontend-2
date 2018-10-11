<template>
  <q-page class="bancor-container">
    <!-- first part -->
    <div class="bancor-top">
      <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
      <span class="font-20 text-black vertical-align-middle">{{$t('BANCOR_TITLE_1')}}</span>
    </div>
    <div class="bancor-content shadow-2">
      <q-table hide-bottom class="no-shadow" :data="bancors" row-key="index" :columns="pireColumns" @request="request" :rows-per-page-options="[10]">
        <q-tr class="row col-12 line-40" slot="header" slot-scope="props" :props="props">
          <q-th class="col-2 align-left" key="name" :props="props">{{$t('BANCOR_TABLE_COL_1')}}</q-th>
          <q-th class="col-2" key="price" :props="props">{{$t('BANCOR_TABLE_COL_2')}}</q-th>
          <q-th class="col-md-3 offset-md-5 col-xs-8" key="action" :props="props">{{$t('BANCOR_TABLE_COL_3')}}</q-th>
        </q-tr>
        <q-tr class="row col-12 border-1" slot="body" slot-scope="props" :props="props">
          <q-td key="name" class="col-2 no-border line-40" :props="props">
            {{props.row.money}}
          </q-td>
          <q-td key="price" class="col-2 no-border line-40" :props="props">
            {{props.row.latestBid}}
          </q-td>
          <q-td key="action" class="col-md-3 col-xs-8 offset-5 no-border" :props="props">
            <div class="btn-group flex justify-around">
              <q-btn color="secondary" @click="callBuyModal(props.row)">{{$t('BANCOR_BUTTON_BUY')}}</q-btn>
              <q-btn color="primary" @click="callSellModal(props.row)">{{$t('BANCOR_BUTTON_SELL')}}</q-btn>
            </div>
          </q-td>
        </q-tr>
      </q-table>
    </div>
    <!-- second part -->
    <div class="bancor-top-2">
      <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
      <span class="font-20 text-black vertical-align-middle">{{$t('BANCOR_TITLE_2')}}</span>
    </div>
    <div class="bancor-content shadow-2">
      <q-table class="no-shadow" :data="historys" row-key="index" :columns="historyColumns" @request="requestHistory" :pagination.sync="pagination" :rows-per-page-options="[10]">
        <q-td slot="body-cell-timestamp" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
        <q-td slot="body-cell-type" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
        <q-td slot="body-cell-source" slot-scope="props" :props="props">
          {{props.row.source + '/' + props.row.target}}
        </q-td>
        <q-td slot="body-cell-ratio" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
        <q-td slot="body-cell-buyed" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
        <q-td slot="body-cell-used" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
      </q-table>
    </div>

    <!-- Modals -->
    <bancor-trade-modal :show="tradeModalShow" :type='dealPairInfo.type' :secondPwd="secondSignature" :buy="dealPairInfo.buy" :sell="dealPairInfo.sell" :balance="amount" :price='dealPairInfo.price' @close="closeTradeModal" @buy="bancorBuy" @sell="bancorSell"></bancor-trade-modal>
  </q-page>
</template>

<script>
/* eslint-disable */
import {
  QPage,
  QTable,
  QBtn,
  QTd,
  QTr,
  QTh
} from 'quasar'
import {
  mapActions,
  mapGetters
} from 'vuex'
import {
  toast,
  toastError,
} from '../utils/util'
import {
  convertFee
} from '../utils/asch'
import BancorTradeModal from '../components/BancorTradeModal'

export default {
  name: 'Bancor',
  components: {
    QPage,
    QTable,
    QBtn,
    QTd,
    QTr,
    QTh,
    BancorTradeModal
  },
  data() {
    return {
      tradeModalShow: false,
      loading: false,
      myBalances: {},
      config: {},
      dealPairInfo: {
        type: 0,
        buy: '',
        sell: '',
        buy: '',
        price: ''
      },
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      bancors: [
        // {
        //   name: 'BTC',
        //   latestBid: '1.653'
        // },
        // {
        //   name: 'ETH',
        //   latestBid: '23.653'
        // }
      ],
      historys: [
        {
          timestamp: '2017/09/08',
          type: 'sell',
          pire: 'BCH/XAS',
          avarage: '1.896XAS',
          amount: 1359,
          total: 99365
        }
      ],
      pireColumns: [
        {
          name: 'name',
          required: true,
          label: this.$t('BANCOR_TABLE_COL_1'),
          align: 'left',
          field: 'name'
        },
        {
          name: 'price',
          required: true,
          label: this.$t('BANCOR_TABLE_COL_2'),
          align: 'left',
          field: 'price'
        },
        {
          name: 'action',
          label: this.$t('BANCOR_TABLE_COL_3'),
          align: 'center',
          field: 'action'
        }
      ],
      historyColumns: [
        {
          name: 'timestamp',
          required: true,
          label: this.$t('BANCOR_HIS_COL_1'),
          align: 'left',
          field: 'timestamp'
        },
        {
          name: 'type',
          required: true,
          label: this.$t('BANCOR_HIS_COL_2'),
          align: 'left',
          field: 'type'
        },
        {
          name: 'source',
          required: true,
          label: this.$t('BANCOR_HIS_COL_3'),
          align: 'left',
          field: 'source'
        },
        {
          name: 'ratio',
          required: true,
          label: this.$t('BANCOR_HIS_COL_4'),
          align: 'left',
          field: 'ratio'
        },
        {
          name: 'buyed',
          required: true,
          label: this.$t('BANCOR_HIS_COL_5'),
          align: 'left',
          field: 'buyed'
        },
        {
          name: 'used',
          required: true,
          label: this.$t('BANCOR_HIS_COL_5'),
          align: 'left',
          field: 'used'
        }
      ]
    }
  },
  async mounted() {
    this.getMyBalances()
    this.getBncorsPairs()
    this.requestHistory()
  },
  methods: {
    ...mapActions(['getBalances', 'getCurrencies', 'getAllAssets', 'getBancorPairs', 'getBancorRecord', 'bancorTradeBySource', 'bancorTradeByTarget']),
    async getBncorsPairs() {
      let result = await this.getBancorPairs()
      if (result.success) {
        this.bancors = result.bancors
        this.bancors.forEach(e => {
          // e.latestBid = '0.23'
        })
      }
    },
    async request() {
      await getBncorsPairs()
    },
    async getMyBalances() {
      let result = await this.getBalances({
        address: this.user.account.address
      })
      if (result.success && result.balances.length > 0) {
        let _tempArr = {}
        _tempArr.XAS = {
          precision: 8
        }
        result.balances.forEach(o => {
          let _obj = o
          _obj.precision = _obj.asset.precision
          _tempArr[o.currency] = _obj
        })
        this.myBalances = _tempArr
      }
    },
    async getBalance() {
      // Get cross chain assets
      let resCross = await this.getCurrencies({
        // address: this.user.account.address,
        // flag: 2
        limit: 9999,
        offset: 0
      })
      // Get side chain assets
      let resSide = await this.getAllAssets({
        limit: 9999,
        offset: 0
      })
      if (resCross.success) {
        // this.myBalances = res.currencies
        let _tempArr = {}
        resCross.currencies.forEach(o => {
          let _obj = o
          _tempArr[o.symbol] = _obj
          // o.precision = o.asset.precision
        })
        this.myBalances = Object.assign(this.myBalances, _tempArr)
      }
      if (resSide.success) {
        let _tempArr = {}
        resSide.assets.forEach(o => {
          let _obj = o
          _tempArr[o.name] = _obj
        })
        this.myBalances = Object.assign(this.myBalances, _tempArr)
      }
    },
    async requestHistory(props) {
      this.loading = true
      if (props) {
        this.pagination = props.pagination
      }
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let result = await this.getBancorRecord({
        address: this.user.address,
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      // TODO:
      if (result.success) {
        this.loading = false
        this.historys = result.data
        this.pagination.rowsNumber = res.count
      }
    },
    closeTradeModal() {
      this.tradeModalShow = false
    },
    callBuyModal(props) {
      this.dealPairInfo.type = 0
      this.dealPairInfo.buy = props.money
      this.dealPairInfo.sell = props.stock
      this.dealPairInfo.price = props.latestBid
      this.config = {
        money: props.money,
        stock: props.stock,
        owner: props.owner
      }
      this.tradeModalShow = true
    },
    callSellModal(props) {
      this.dealPairInfo.type = 1
      this.dealPairInfo.buy = props.stock
      this.dealPairInfo.sell = props.money
      this.dealPairInfo.price = props.latestBid
      this.config = {
        money: props.money,
        stock: props.stock,
        owner: props.owner
      }
      this.tradeModalShow = true
    },
    async bancorBuy(num) {
      console.log(this.dealPairInfo.buy, this.dealPairInfo.sell, num, num * Math.pow(10, this.myBalances[this.dealPairInfo.sell].precision))
      let result = await this.bancorTradeBySource({
        source: this.dealPairInfo.sell,
        target: this.dealPairInfo.buy,
        sourceAmount: num * Math.pow(10, this.myBalances[this.dealPairInfo.sell].precision),
        config: this.config
      })
      if (result.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        this.tradeModalShow = false
      }
      toastError(res.error)
    },
    async bancorSell(num) {
      console.log(this.dealPairInfo.buy, this.dealPairInfo.sell, num, num * Math.pow(10, this.myBalances[this.dealPairInfo.sell].precision))
      let result = await this.bancorTradeBySource({
        source: this.dealPairInfo.sell,
        target: this.dealPairInfo.buy,
        sourceAmount: num * Math.pow(10, this.myBalances[this.dealPairInfo.sell].precision),
        config: this.config
      })
      if (result.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        this.tradeModalShow = false
      }
      toastError(res.error)
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    },
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : ''
    },
    balance() {
      return this.user.account.xas / Math.pow(10, 8)
    },
    // TODO
    amount() {
      if (this.myBalances && this.dealPairInfo.sell !== 'XAS' && this.dealPairInfo.sell) {
        return convertFee(this.myBalances[this.dealPairInfo.sell].balance, this.myBalances[this.dealPairInfo.sell].precision)
      }
      return this.balance
    }
  }
}
</script>

<style lang="stylus" scoped>
.bancor-container
  padding 20px
.bancor-content
  background #ffffff
  border-radius 6px
.bancor-top
  margin-bottom: 20px;
.bancor-top-2
  margin-top: 40px;
  margin-bottom: 20px;
.border-1
  border-bottom: 1px solid rgba(0,0,0,0.12);
.line-40
  line-height 40px;
</style>
