<template>
  <q-page class="gatewayDetail-container">
    <div class="gatewayDetail-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
          <i class="material-icons vertical-align-sub font-20 text-black">border_color</i>
          <h5 class="q-px-md inline-block font-18 q-my-none">{{$t('COUNCIL_PARTICULARS')}}</h5>
        </span>
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
        </div>

        <div v-if="accountLeft" :class="gatewayDetailClass">
          <q-card class="desktop-only no-shadow" align="left">
            <div class="bg-white shadow-2">
              <q-card-title class="bg-nine">
                <span class="font-22 text-black font-weight">{{$t('DAPP_BANLANCE_DETAIL')}}</span>
              </q-card-title>
              <q-card-main class="word-wrap-break q-card-main q-card-container padding-b-40 padding-t-40">
              <span class="font-30 text-secondary">{{accountLeft | fee}}</span><span class="q-pl-xs">XAS</span>
              </q-card-main>
            </div>
          </q-card>
        </div>
      </div>
      <div class="col-12 bg-white q-px-md q-py-md">
        <trans-record-container :userInfo="councilAccount" class="table"/>
      </div>
    </div>

  </q-page>
</template>

<script>
import { QPage, QTable, QCard, QCardTitle, QCardMain, QBtn, QTd } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import { compileTimeStamp, getTimeFromHight } from '../utils/util'
import TransRecordContainer from '../components/TransRecordContainer'

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
    TransRecordContainer
  },
  data() {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: this.$t('COUNCIL_PAGE.MEMBER'),
          align: 'center',
          field: 'name'
        },
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
      group: null,
      accountLeft: 0,
      address: 'GADQ2bozmxjBfYHDQx3uwtpwXmdhafUdkN'
    }
  },
  methods: {
    ...mapActions(['getCouncil', 'getAccountsInfo']),
    async loadData() {
      let res = await this.getCouncil({
        address: this.address
      })
      if (res.success && res.group) {
        this.group = res.group
        this.datas = res.group.members
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
  mounted() {
    this.loadData()
    this.getGroupAccount()
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

