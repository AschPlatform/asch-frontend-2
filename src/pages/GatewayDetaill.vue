<template>
  <q-page >
    <div class="no-wrap q-pa-md row justify-between">
      <span>
        <i class="material-icons vertical-align-sub font-24 text-black">border_color</i>
        <h5 class="q-px-md inline-block">{{$t('GATEWAY_PARTICULARS')}}</h5>
        </span>
      <!-- <q-btn color="secondary" class="self-center" @click="$router.push('gateway')">
        {{$t('CANCEL')}}
      </q-btn> -->
    </div>
    <div class="row q-px-md gutter-md">
      <div class="col-8">
        <q-table :title="$t('COUNCIL_PAGE.MODAL_TITLE', {number: datas.length})" :data="datas" :columns="columns" :pagination.sync="pagination" @request="request" :loading="loading">
  
          <q-td slot="body-cell-operation" slot-scope="props" :props="props">
            <div class="text-secondary" @click="viewAccountInfo(props.row)">
              {{$t('CHECK')}}
            </div>
          </q-td>
  
          <!-- <q-td slot="body-cell-"  slot-scope="props" :props="props">
            <div class="text-primary" @click="viewAccountInfo(props.row)">
              {{$t('CHECK')}}
            </div>
          </q-td> -->
  
        </q-table>
      </div>
      <div class="col-4">
          <q-card class="gateway-modal-right-card no-shadow" align="left">
            <div class=" modal-right-container shadow-2">
            <q-card-title class="bg-nine">
              <span class="font-16 text-black">{{gateway.name}}</span>
            </q-card-title>
            <q-card-main>
              <span class="font-16 text-five">{{gateway.desc}}</span>
            </q-card-main>
            </div>
          </q-card>
        <q-card class="gateway-modal-right-card no-shadow" align="left">
          <div class="modal-right-container modal-right-container-bottom shadow-2 row">
          <q-card-title class="bg-nine self-start bottom-container-top">
            <span class="font-16 text-black">{{$t('UPDATE_LIMIT')}}</span>
          </q-card-title>
          <q-card-main class="self-end bottom-container-bottom">
            <span class="font-24 text-secondary">{{convertFrequency(gateway.updateInterval)}}{{$t('FRAGIL_DAY')}}</span>
          </q-card-main>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import { QPage, QTable, QCard, QCardTitle, QCardMain, QBtn } from 'quasar'
import { mapActions } from 'vuex'

export default {
  name: 'GatewayDetail',
  props: [],
  components: {
    QPage,
    QTable,
    QCard,
    QCardTitle,
    QCardMain,
    QBtn
  },
  data() {
    return {
      columns: [
        {
          name: 'gateway',
          required: true,
          label: this.$t('COUNCIL_PAGE.MEMBER'),
          align: 'center',
          field: 'gateway'
        },
        {
          name: 'desc',
          required: true,
          label: this.$t('DESCRIBE'),
          align: 'center',
          field: 'desc'
        },
        {
          name: 'address',
          required: true,
          label: this.$t('COUNCIL_PAGE.ADDRESS'),
          align: 'center',
          field: 'address'
        },
        {
          name: 'elected',
          required: true,
          label: this.$t('ELECTED'),
          align: 'center',
          field: 'elected'
        },
        {
          name: 'operation',
          required: true,
          label: this.$t('COUNCIL_PAGE.OPERATION'),
          align: 'center',
          field: 'operation'
        }
      ],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 1
      },
      loading: false,
      datas: [],
      gateway: {}
    }
  },

  methods: {
    ...mapActions(['getGatewayDelegates']),
    viewAccountInfo(row) {
      this.$root.$emit('openAccountModal', row.address)
    },
    async loadData() {
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await this.getGatewayDelegates({
        limit: limit,
        offset: (pageNo - 1) * limit,
        name: this.gateway.name
      })
      if (res.success) {
        this.datas = res.validators
      }
    },
    async request(props) {
      this.loading = true
      this.pagination = props.pagination
      this.filter = props.filter
      await this.loadData()
      this.loading = false
    },
    convertFrequency(val) {
      return Math.floor(val / 8640)
    }
  },
  mounted() {
    let { gateway } = this.$route.params
    if (!gateway) {
      this.$router.push('gateway')
    }
    this.gateway = gateway
    if (gateway && gateway.agent) {
      this.loadData()
    }
  },
  computed: {},
  watch: {
    gateway(val) {
      if (val) this.loadData()
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-table-top {
  background: #e7ebee !important;
}

.gateway-modal-right-card {
  height: 50%;
}

.modal-right-container {
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
</style>
