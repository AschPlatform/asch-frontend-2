<template>
  <q-page class="bancor-container">
    <!-- first part `BCH`-->
    <div class="bancor-top">
      <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
      <span class="font-20 text-black vertical-align-middle">{{$t('BANCOR_TITLE_1')}}</span>
    </div>
    <div class="bancor-content shadow-2">
      <q-table hide-bottom class="no-shadow" :data="bancorsBCH" row-key="index" :loading="loading" :columns="pireColumnsBCH" @request="request" :rows-per-page-options="[10]">
        <q-tr class="row col-12 line-40" slot="header" slot-scope="props" :props="props">
          <q-th class="col-2 align-left" key="name" :props="props">{{$t('BANCOR_TABLE_COL_1')}}</q-th>
          <q-th class="col-2" key="price" :props="props">{{$t('BANCOR_TABLE_COL_2')}}</q-th>
          <q-th class="col-md-3 offset-md-5 col-xs-8" key="action" :props="props">{{$t('BANCOR_TABLE_COL_3')}}</q-th>
        </q-tr>
        <q-tr class="row col-12 border-1" slot="body" slot-scope="props" :props="props">
          <q-td key="name" class="col-2 no-border line-40" :props="props">
            {{props.row.stock}}
          </q-td>
          <q-td key="price" class="col-2 no-border line-40" :props="props">
            {{(1 / props.row.latestBid).toFixed(6)}}
          </q-td>
          <q-td key="action" class="col-md-3 col-xs-8 offset-5 no-border" :props="props">
            <div class="btn-group flex justify-around">
              <q-btn color="secondary" :disable="!myBalances['BCH'] || myBalances['BCH'].balance === 0" @click="callBuyModal(props.row)">{{$t('BANCOR_BUTTON_BUY')}}</q-btn>
              <q-btn color="red" :disabled="!myBalances[props.row.money] || myBalances[props.row.money].balance === '0'" @click="callSellModal(props.row)">{{$t('BANCOR_BUTTON_SELL')}}</q-btn>
            </div>
          </q-td>
        </q-tr>
      </q-table>
    </div>
    <!-- second part `XAS`-->
    <div class="bancor-top q-mt-md">
      <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
      <span class="font-20 text-black vertical-align-middle">{{$t('BANCOR_TITLE_2')}}</span>
    </div>
    <div class="bancor-content shadow-2">
      <q-table hide-bottom class="no-shadow" :data="bancorsXAS" row-key="index" :loading="loading" :columns="pireColumnsXAS" @request="request" :rows-per-page-options="[10]">
        <q-tr class="row col-12 line-40" slot="header" slot-scope="props" :props="props">
          <q-th class="col-2 align-left" key="name" :props="props">{{$t('BANCOR_TABLE_COL_1')}}</q-th>
          <q-th class="col-2" key="price" :props="props">{{$t('BANCOR_TABLE_COL_2')}}</q-th>
          <q-th class="col-md-3 offset-md-5 col-xs-8" key="action" :props="props">{{$t('BANCOR_TABLE_COL_3')}}</q-th>
        </q-tr>
        <q-tr class="row col-12 border-1" slot="body" slot-scope="props" :props="props">
          <q-td key="name" class="col-2 no-border line-40" :props="props">
            {{props.row.stock}}
          </q-td>
          <q-td key="price" class="col-2 no-border line-40" :props="props">
            {{(1 / props.row.latestBid).toFixed(6)}}
          </q-td>
          <q-td key="action" class="col-md-3 col-xs-8 offset-5 no-border" :props="props">
            <div class="btn-group flex justify-around">
              <q-btn color="secondary" :disable="balance === 0" @click="callBuyModal(props.row)">{{$t('BANCOR_BUTTON_BUY')}}</q-btn>
              <q-btn color="red" :disabled="!myBalances[props.row.money] || myBalances[props.row.money].balance === '0'" @click="callSellModal(props.row)">{{$t('BANCOR_BUTTON_SELL')}}</q-btn>
            </div>
          </q-td>
        </q-tr>
      </q-table>
    </div>
    <!-- third part -->
    <div class="bancor-top-2">
      <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
      <span class="font-20 text-black vertical-align-middle">{{$t('BANCOR_TITLE_3')}}</span>
    </div>
    <div class="bancor-content shadow-2">
      <q-table class="no-shadow" :data="historys" row-key="index" :columns="historyColumns" :loading="loading" @request="requestHistory" :pagination.sync="pagination" :rows-per-page-options="[10]">
        <q-td slot="body-cell-timestamp" slot-scope="props" :props="props">
          {{fullTimestamp(props.value)}}
        </q-td>
        <q-td :class="props.row.source === 'XAS' ? 'text-secondary' : 'text-negative'" slot="body-cell-type" slot-scope="props" :props="props">
          {{judge(props)}}
        </q-td>
        <q-td slot="body-cell-source" slot-scope="props" :props="props">
          {{props.row.source + '/' + props.row.target}}
        </q-td>
        <q-td slot="body-cell-price" slot-scope="props" :props="props">
          {{props.value}} {{props.row.source}}
        </q-td>
        <q-td slot="body-cell-buyed" slot-scope="props" :props="props">
          {{convertFee(props.row.targetAmount, props.row.targetPrecision)}} {{props.row.target}}
        </q-td>
        <q-td slot="body-cell-used" slot-scope="props" :props="props">
          {{convertFee(props.row.sourceAmount, props.row.sourcePrecision)}} {{props.row.source}}
        </q-td>
      </q-table>
    </div>

    <!-- Modals -->
    <bancor-trade-modal :show="tradeModalShow" :type='dealPairInfo.type' :secondPwd="secondSignature" :buy="dealPairInfo.buy" :sell="dealPairInfo.sell" :balance="amount" :price='dealPairInfo.price' @close="closeTradeModal" @buy="bancorBuy" @sell="bancorSell"></bancor-trade-modal>
  </q-page>
</template>

<script>
/* eslint-disable */
import { QPage, QTable, QBtn, QTd, QTr, QTh } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import { toast, translateErrMsg } from '../utils/util'
import { convertFee } from '../utils/asch'
import BancorTradeModal from '../components/BancorTradeModal'
import { fullTimestamp } from '../utils/asch'
import { BigNumber } from 'bignumber.js'

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
      bancorsXAS: [
        // {
        //   name: 'BTC',
        //   latestBid: '1.653'
        // },
        // {
        //   name: 'ETH',
        //   latestBid: '23.653'
        // }
      ],
      bancorsBCH: [],
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
      pireColumnsXAS: [
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
      pireColumnsBCH: [
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
          name: 'price',
          required: true,
          label: this.$t('BANCOR_HIS_COL_4'),
          align: 'left',
          field: 'price'
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
          label: this.$t('BANCOR_HIS_COL_6'),
          align: 'left',
          field: 'used'
        }
      ]
    }
  },
  async mounted() {
    this.initData()
  },
  methods: {
    convertFee,
    fullTimestamp,
    ...mapActions([
      'getBalances',
      'getCurrencies',
      'getAllAssets',
      'getBancorPairs',
      'getBancorRecord',
      'bancorTradeBySource',
      'bancorTradeByTarget'
    ]),
    async getBncorsPairs() {
      let resultXAS = await this.getBancorPairs({
        currency: 'XAS'
      })
      let resultBCH = await this.getBancorPairs({
        currency: 'BCH'
      })
      if (resultXAS.success) {
        this.bancorsXAS = resultXAS.bancors
      }
      if (resultBCH.success) {
        this.bancorsBCH = resultBCH.bancors
      }
    },
    async initData() {
      if (this.user && this.user.account) {
        await this.getMyBalances()
        await this.getBncorsPairs()
        await this.requestHistory()
      }
    },
    async request() {
      await getBncorsPairs()
    },
    async getMyBalances() {
      let result = await this.getBalances({
        address: this.user.account.address
      })
      let tempArr = {}
      tempArr.XAS = {
        precision: 8
      }
      if (result.success && result.balances.length > 0) {
        result.balances.forEach(o => {
          let obj = o
          obj.precision = obj.asset.precision
          tempArr[o.currency] = obj
        })
      }
      this.myBalances = tempArr
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
        let tempArr = {}
        resCross.currencies.forEach(o => {
          let obj = o
          tempArr[o.symbol] = obj
          // o.precision = o.asset.precision
        })
        this.myBalances = Object.assign(this.myBalances, tempArr)
      }
      if (resSide.success) {
        let tempArr = {}
        resSide.assets.forEach(o => {
          let obj = o
          tempArr[o.name] = obj
        })
        this.myBalances = Object.assign(this.myBalances, tempArr)
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
        this.historys = result.trades
        this.pagination.rowsNumber = result.count
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
      let result = await this.bancorTradeBySource({
        source: this.dealPairInfo.sell,
        target: this.dealPairInfo.buy,
        sourceAmount: BigNumber(num).times(
          Math.pow(10, this.myBalances[this.dealPairInfo.sell].precision)
        ),
        config: this.config
      })
      if (result.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        this.tradeModalShow = false
      } else {
        translateErrMsg(result.error)
      }
    },
    async bancorSell(num) {
      let result = await this.bancorTradeBySource({
        source: this.dealPairInfo.sell,
        target: this.dealPairInfo.buy,
        sourceAmount: BigNumber(num).times(
          Math.pow(10, this.myBalances[this.dealPairInfo.sell].precision)
        ),
        config: this.config
      })
      if (result.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        this.tradeModalShow = false
      } else {
        translateErrMsg(result.error)
      }
    },
    judge(props) {
      if (props.row.source === 'XAS') {
        return this.$t('BANCOR_BUTTON_BUY')
      }
      return this.$t('BANCOR_BUTTON_SELL')
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
      let XasBalance = this.user && this.user.account ? this.user.account.xas : 0
      let balance = BigNumber(XasBalance)
        .div(Math.pow(10, 8))
        .toString()
      return balance
    },
    // TODO
    amount() {
      if (this.myBalances && this.dealPairInfo.sell !== 'XAS' && this.dealPairInfo.sell) {
        return convertFee(
          this.myBalances[this.dealPairInfo.sell].balance,
          this.myBalances[this.dealPairInfo.sell].precision
        )
      }
      return this.balance
    }
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.initData()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.bancor-container {
  padding: 20px;
}

.bancor-content {
  background: #ffffff;
  border-radius: 6px;
}

.bancor-top {
  margin-bottom: 20px;
}

.bancor-top-2 {
  margin-top: 40px;
  margin-bottom: 20px;
}

.border-1 {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.line-40 {
  line-height: 40px;
}
</style>
