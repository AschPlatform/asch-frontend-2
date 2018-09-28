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
            {{props.row.name}}
          </q-td>
          <q-td key="price" class="col-2 no-border line-40" :props="props">
            {{props.row.latestBid}}
          </q-td>
          <q-td key="action" class="col-md-3 col-xs-8 offset-5 no-border" :props="props">
            <div class="btn-group flex justify-around">
              <q-btn color="secondary">{{$t('BANCOR_BUTTON_BUY')}}</q-btn>
              <q-btn color="primary">{{$t('BANCOR_BUTTON_SELL')}}</q-btn>
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
      <q-table class="no-shadow" :data="historys" row-key="index" :columns="historyColumns" @request="requestHistory" :rows-per-page-options="[10]">
        <q-td slot="body-cell-timestamp" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
        <q-td slot="body-cell-type" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
        <q-td key="pair" slot-scope="props" :props="props">
          {{props.row.source + '/' + props.row.target}}
        </q-td>
        <q-td slot="body-cell-price" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
        <q-td slot="body-cell-amount" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
        <q-td slot="body-cell-total" slot-scope="props" :props="props">
          {{props.value}}
        </q-td>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import {
  QPage,
  QTable,
  QBtn,
  QTd,
  QTr,
  QTh
} from 'quasar'

export default {
  name: 'Bancor',
  components: {
    QPage,
    QTable,
    QBtn,
    QTd,
    QTr,
    QTh
  },
  data() {
    return {
      bancors: [
        {
          name: 'BTC',
          latestBid: '1.653'
        },
        {
          name: 'ETH',
          latestBid: '23.653'
        }
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
          label: this.$t('BANCOR_HIS_COL_1'),
          align: 'left',
          field: 'type'
        },
        {
          name: 'pair',
          required: true,
          label: this.$t('BANCOR_HIS_COL_2'),
          align: 'left',
          field: 'pair'
        },
        {
          name: 'avarage',
          required: true,
          label: this.$t('BANCOR_HIS_COL_3'),
          align: 'left',
          field: 'avarage'
        },
        {
          name: 'amount',
          required: true,
          label: this.$t('BANCOR_HIS_COL_4'),
          align: 'left',
          field: 'amount'
        },
        {
          name: 'total',
          required: true,
          label: this.$t('BANCOR_HIS_COL_5'),
          align: 'left',
          field: 'total'
        }
      ]
    }
  },
  methods: {
    request() {}
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
