<template>
  <q-page class="gatewayDetail-container">
    <div class="gatewayDetail-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
          <i class="material-icons vertical-align-sub font-20 text-black">border_color</i>
          <h5 class="q-px-md inline-block text-tertiary font-18 q-my-none">{{$t('COUNCIL_PARTICULARS')}}</h5>
        </span>
      </div>
      <div class="title-line">
        <boundary-line />
      </div>
      <div class="row q-px-md gutter-md">
        <div class="col-md-8 col-xs-12">
          <q-table :title="$t('COUNCIL_PAGE.MODAL_TITLE', {number: datas.length})" :data="datas" :columns="columns" @request="request" :loading="loading" row-key="address" :rows-per-page-options="[10]" hide-bottom>
            <q-td slot="body-cell-address" slot-scope="props" :props="props">
              <div class="text-secondary cursor-pointer" @click="viewAccountInfo(props.row.member)">
                {{props.row.member}}
              </div>
            </q-td>
          </q-table>
          <div class="row justify-between gutter-md pool-container">
            <q-card class="col-md-6 col-xs-12 no-shadow" align="left">
              <div class="bg-white shadow-2">
                <q-card-title class="bg-nine ">
                  <span class="font-16 text-five font-weight">{{$t('BUY_BACK_POOL')}}</span>
                  <span class="font-16 text-five font-weight relative-position message-content"> 
                    <i class="material-icons vertical-align-sub font-20 text-secondary margin-left-10 cursor-pointer">help</i>
                    <prompt-message :message="$t('BUY_BACK_POOL_CONTENT')" />
                 </span>
                </q-card-title>
                <q-card-main class="word-wrap-break q-card-main q-card-container padding-b-40 padding-t-40 relative-position">
                  <span class="font-30 text-five">{{buyBackBalance | fee}}</span><span class="q-pl-xs font-futura text-secondary">BCH</span>
                  <div class="card-main-icon">
                    <img class="buy-back-icon" :src="buyBackIcon" alt="icon">
                  </div>
                </q-card-main>
              </div>
            </q-card>
            <q-card class="col-md-6 col-xs-12 no-shadow" align="left">
              <div class="bg-white shadow-2">
                <q-card-title class="bg-nine">
                  <span class="font-16 text-five font-weight">{{$t('BURN_POOL')}}</span>
                  <span class="font-16 text-five font-weight relative-position message-content">
                    <i class="material-icons vertical-align-sub font-20 text-secondary margin-left-10 cursor-pointer">help</i>
                    <prompt-message :message="$t('BURN_POOL_CONTENT')" />
                  </span>
                </q-card-title>
                <q-card-main class="word-wrap-break q-card-main q-card-container padding-b-40 padding-t-40 relative-position">
                  <span class="font-30 text-five">{{burnAccount | fee}}</span><span class="q-pl-xs font-futura text-secondary">XAS</span>
                  <div class="card-main-icon">
                    <img class="burn-icon" :src="burnIcon" alt="icon">
                  </div>
                </q-card-main>
              </div>
            </q-card>
          </div>
        </div>
  
        <div v-if="accountLeft" :class="gatewayDetailClass">
          <q-list class="column padding-0 council-list">
            <q-list-header class="font-16 text-five font-weight bg-nine padding-l-15" inset>{{$t('COUNCILDETAIL_BANLANCE')}}</q-list-header>
            <q-item v-for="(balance, idx) in balances" :key="idx">
              <q-item-side>
                <q-item-tile avatar>
                  <asset-icon :iconKey="balance.label" />
                </q-item-tile>
              </q-item-side>
              <q-item-main>
                <q-item-tile class="text-five font-16" label>{{balance.label}}</q-item-tile>
              </q-item-main>
              <q-item-side right>
                <q-item-tile class="text-five font-16">
                  {{balance.value | fee}}
                </q-item-tile>
              </q-item-side>
            </q-item>
          </q-list>
        </div>
      </div>
      <div class="col-12 bg-white q-px-md q-py-md">
        <trans-record-container :userInfo="councilAccount" class="table" />
      </div>
    </div>
  
  </q-page>
</template>

<script>
import {
  QPage,
  QTable,
  QCard,
  QCardTitle,
  QCardMain,
  QBtn,
  QTd,
  QList,
  QListHeader,
  QItem,
  QItemMain,
  QItemSide,
  QItemTile,
  QItemSeparator
  // QScrollArea
} from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import { compileTimeStamp, getTimeFromHight } from '../utils/util'
import TransRecordContainer from '../components/TransRecordContainer'
import BoundaryLine from '../components/BoundaryLine'
import AssetIcon from '../components/AssetIcon'
import PromptMessage from '../components/PromptMessage'
import burnIcon from '../assets/burn_icon.png'
import buyBackIcon from '../assets/buy_back_icon.png'

export default {
  name: 'councilDetail',
  props: [],
  components: {
    QPage,
    QTable,
    QCard,
    QCardTitle,
    QCardMain,
    QBtn,
    QTd,
    QList,
    QListHeader,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    QItemSeparator,
    TransRecordContainer,
    BoundaryLine,
    AssetIcon,
    PromptMessage
    // QScrollArea,
    // VueMarkdown
  },
  data() {
    return {
      burnIcon,
      buyBackIcon,
      isMouseover: false,
      columns: [
        // {
        //   name: 'name',
        //   required: true,
        //   label: this.$t('COUNCIL_PAGE.MEMBER'),
        //   align: 'center',
        //   field: 'name'
        // },
        {
          name: 'weight',
          required: true,
          label: this.$t('WEIGHT'),
          align: 'center',
          field: 'weight'
        },
        {
          name: 'address',
          required: true,
          label: this.$t('COUNCIL_PAGE.ADDRESS'),
          align: 'center',
          field: 'member'
        }
      ],
      loading: false,
      datas: [],
      balances: [],
      group: null,
      accountLeft: 0,
      buyBackBalance: 0,
      burnAccount: 0,
      address: 'GADQ2bozmxjBfYHDQx3uwtpwXmdhafUdkN',
      buyBackAddress: 'ARepurchaseAddr1234567890123456789',
      burnAddress: 'ABuringPoolAddr1234567890123456789'
    }
  },
  mounted() {
    this.loadData()
    this.getGroupAccount()
    this.getBurnAccount()
    this.getBuyBackBalance()
    this.getCouncilAssets()
  },
  methods: {
    ...mapActions(['getCouncil', 'getAccountsInfo', 'getBalances']),
    async loadData() {
      let res = await this.getCouncil({
        address: this.address
      })
      if (res.success && res.group) {
        this.group = res.group
        this.datas = res.group.members
      }
    },
    async getCouncilAssets() {
      let balances = []
      let accountRes = await this.getAccountsInfo({
        address: this.address
      })

      if (accountRes.success && accountRes.account) {
        balances.push({
          label: 'XAS',
          value: accountRes.account.xas
        })
      }

      let balancesRes = await this.getBalances({
        address: this.address
      })
      if (balancesRes.success && balancesRes.balances.length >= 1) {
        balancesRes.balances.forEach(balance => {
          if (balance.balance >= 1) {
            balances.push({
              label: balance.currency,
              value: balance.balance
            })
          }
        })
      }
      this.balances = this.balances.concat(balances)
    },
    async getBurnAccount() {
      let res = await this.getAccountsInfo({
        address: this.burnAddress
      })
      if (res.success && res.account) {
        this.burnAccount = res.account.xas
      }
    },
    async getBuyBackBalance() {
      let res = await this.getBalances({
        address: this.buyBackAddress
      })
      if (res.success && res.balances) {
        this.buyBackBalance = res.balances[0].balance
      }
    },
    async getGroupAccount() {
      let res = await this.getAccountsInfo({
        address: this.address
      })
      if (res.success && res.account) {
        this.accountLeft = res.account.xas
      }
    },
    async request(props) {
      this.loading = true
      this.filter = props.filter
      await this.loadData()
      this.loading = false
    },
    convertFrequency(val) {
      return Math.floor(val / 8640)
    },
    compileTimeStamp(timestamp) {
      return compileTimeStamp(timestamp)
    },
    getTimeFromHight(height) {
      return getTimeFromHight(this.latestBlock, height)
    },
    viewAccountInfo(row) {
      this.$root.$emit('openAccountModal', row)
    }
  },
  computed: {
    ...mapGetters(['latestBlock', 'userInfo']),
    gatewayDetailClass() {
      return this.isDesk ? 'col-md-4 col-xs-12' : 'col-md-4 col-xs-12 margin-top-minus-28'
    },
    councilAccount() {
      return {
        address: this.address,
        account: {
          address: this.address
        }
      }
    }
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.loadData()
        this.getGroupAccount()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.gatewayDetail-container {
  padding: 20px;

  .gatewayDetail-content {
    background: #ffffff !important;
    padding-bottom: 20px;
    border-radius: 6px;

    .title-line {
      padding: 12px 16px 28px;
    }

    .pool-container {
      margin: 0px 0px 30px -32px;
    }

    .council-list {
      .q-list-header {
        padding: 23px 16px !important;
      }

      .q-item:last-child {
        border: none;
      }

      .q-item {
        border-bottom: 1px solid #dddddd;
      }
    }

    .card-main-icon {
      position: absolute;
      right: 14px;
      bottom: 14px;

      .buy-back-icon {
        width: 57px;
      }

      .burn-icon {
        width: 40px;
      }
    }
  }
}

.q-table-top {
  background: #e7ebee !important;
}

.gateway-modal-right-card {
  height: 50%;
}

.modal-right-container {
  background: #ffffff;
  height: calc(100% - 10px);
}

.modal-right-container-bottom {
  margin-top: 10px;
}

.bottom-container-top {
  width: 100%;
}

.bottom-container-bottom {
  width: 100%;
  text-align: center;
}

.q-table-container {
  background: #ffffff;
}

.word-wrap-break {
  word-wrap: break-word;
}

.margin-top-minus-28 {
  margin-top: -28px;
}
</style>

