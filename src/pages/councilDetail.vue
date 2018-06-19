<template>
  <q-page class="gatewayDetail-container">
    <div class="gatewayDetail-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
          <i class="material-icons vertical-align-sub font-24 text-black">border_color</i>
          <h5 class="q-px-md inline-block">{{$t('COUNCIL_PARTICULARS')}}</h5>
          </span>
        <!-- <q-btn color="secondary" class="self-center" @click="$router.push('gateway')">
          {{$t('CANCEL')}}
        </q-btn> -->
      </div>
      <div class="row q-px-md gutter-md">
        <div class="col-md-8 col-xs-12">
         <q-card class="mobile-only no-shadow margin-bottom-20" align="left">
            <div class="bg-white shadow-2">
              <q-card-title class="bg-nine">
                <span class="font-22 text-black font-weight">{{group.name}}</span>
              </q-card-title>
              <q-card-main class="word-wrap-break">
              {{group.updateInterval}}
              </q-card-main>
            </div>
          </q-card>

          <q-table :title="$t('COUNCIL_PAGE.MODAL_TITLE', {number: datas.length})" :data="datas" :columns="columns" :pagination.sync="pagination" @request="request" :loading="loading" row-key="address" hide-bottom>
  
            <q-td slot="body-cell-address" slot-scope="props" :props="props">
              <div class="text-secondary cursor-pointer" @click="viewAccountInfo(props.row.member)">
                {{props.row.member}}
              </div>
            </q-td>
  
            <!-- <q-td slot="body-cell-"  slot-scope="props" :props="props">
              <div class="text-primary" @click="viewAccountInfo(props.row)">
                {{$t('CHECK')}}
              </div>
            </q-td> -->
  
          </q-table>
        </div>

        <div v-if="group" :class="gatewayDetailClass">
          <q-card class="desktop-only no-shadow" align="left">
            <div class="bg-white shadow-2">
              <q-card-title class="bg-nine">
                <span class="font-22 text-black font-weight">{{group.name}}</span>
              </q-card-title>
              <q-card-main class="word-wrap-break">
              {{group.updateInterval}}
              </q-card-main>
            </div>
          </q-card>
          <q-card class="no-shadow margin-top-20" align="left">
            <div class="bg-white modal-right-container-bottom shadow-2 row">
              <q-card-title class="bg-nine self-start bottom-container-top">
                <span class="font-16 text-black">{{$t('LASTEST_UPDATE_TIME')}}</span>
              </q-card-title>
              <q-card-main class="self-center bottom-container-bottom height-62">
                <span class="font-24 text-secondary">{{compileTimeStamp(group.createTime)}}</span>
              </q-card-main>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <div class="col-12 shadow-1">
      <trans-record-container :userInfo="councilAccount" class="table"/>
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
      group: null
    }
  },
  methods: {
    ...mapActions(['getCouncil']),
    async loadData() {
      let res = await this.getCouncil({
        address: 'G3sQzuWpvXZjxhoYnvvJvnfUUEo8aNzKdj'
      })
      if (res.success) {
        this.group = res.group
        this.datas = res.group.members
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
  },
  computed: {
    ...mapGetters(['latestBlock', 'userInfo']),
    gatewayDetailClass() {
      return this.isDesk ? 'col-md-4 col-xs-12' : 'col-md-4 col-xs-12 margin-top-minus-28'
    },
    councilAccount() {
      return {
        address: 'G3sQzuWpvXZjxhoYnvvJvnfUUEo8aNzKdj',
        account: {
          address: 'G3sQzuWpvXZjxhoYnvvJvnfUUEo8aNzKdj'
        }
      }
    }
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.loadData()
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
    padding-bottom: 40px;
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

