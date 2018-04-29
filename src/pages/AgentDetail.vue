
<template>
  <q-page class="padding-20 border-r-6">
    <div v-if="userAccount" class="row padding-20 bg-white">
      <div class="col-12 padding-l-15">
       <i class="material-icons vertical-align-middle font-24 text-secondary">perm_identity</i>
       <span class="font-24 vertical-align-middle font-weight">{{$t('VOTE_DELEGATE_DETAIL')}}</span>
      </div>
      <q-card class="col-9 no-shadow">
        <q-card-main v-if="userInfo">
          <q-tabs v-model="selectedTab" no-pane-border inverted class="tab-container shadow-1 col-9 " align="justify">
            <q-tab default name="supporters" slot="title" color="secondary" icon="people" :label="$t('AGENT_VOTE_DETAIL')" />
            <q-tab name="records" slot="title" icon="face" color="secondary" :label="$t('AGENT_VOTE_RECORDS')" />
            <div>
              <!-- come from VR page -->
              <q-table :no-data-label="$t('table.noData')" :data="datas" :filter="filter" color="secondary" :columns="dynamicCol" row-key="id" :loading="loading" :rows-per-page-options="[10]">
<template slot="top-right" slot-scope="props">
                      <q-btn flat round  icon="refresh" color="secondary" @click="refresh" />
</template>
           
          <q-td slot="body-cell-address"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="viewAccountInfo(props.row)">
              {{props.value}}
            </div>
          </q-td>
          <!-- vote agent overview -->
          <q-td slot="body-cell-name"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="viewAccountInfo(props.row)">
              {{showName(props.row)}}
            </div>
          </q-td>
          <q-td slot="body-cell-lockHeight"  slot-scope="props" :props="props">
            {{showEndTime(props.row)}}
          </q-td>
          <q-td slot="body-cell-xas"  slot-scope="props" :props="props">
            {{showContent(props.row, 'weight') | fee(8)}}
          </q-td>
          <q-td slot="body-cell-agent"  slot-scope="props" :props="props">
            {{showTime(props.row) | time}}
          </q-td>
          <!-- <q-td slot="body-cell-weight"  slot-scope="props" :props="props">
            {{showContent(props.row, 'weight') | fee(8)}}
          </q-td> -->
          <!-- vote record overview -->
          <q-td slot="body-cell-delegate"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="viewAccountInfo(props.row, true)">
              {{showName(props.row, true)}}
            </div>
          </q-td>
          <q-td slot="body-cell-voteTime"  slot-scope="props" :props="props">
            {{showTime(props.row) | time}}
          </q-td>
          <!-- <q-td slot="body-cell-opt"  slot-scope="props" :props="props">
            <q-btn @click="viewAccountInfo(props.row)" icon="remove red eye" size="sm" flat color="primary" >
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DAPP_DETAIL')}}</q-tooltip>
            </q-btn>
            <q-icon color="positive" v-if="props.row.voted" name="icon-chrome" />
          </q-td> -->
        </q-table>
    </div>
    </q-tabs>
      </q-card-main>
    </q-card>

    <q-card v-if="userAccount" class="col-3 margin-t-15 no-shadow">
      <div class="shadow-2 bg-white">
      <q-card-title class="bg-nine text-black font-22 height-62">
        {{$t('AGENT_DETAIL')}}
      </q-card-title>
      <q-card-main class="padding-20" align="center">
        <div class="text-secondary font-30 margin-t-20">
          {{user.account.agent || user.account.name}}
        </div>
        <div>
          <span class="font-16 text-black vertical-align-middle">{{$t('AGENT_WEIGHT')+':'}}</span>
          <span class="font-30 text-secondary vertical-align-middle">{{agentWeight}}</span>
        </div>
      </q-card-main>
      </div>
    </q-card>
    </div>
     
  </q-page>
</template>

<script>
import {
  QPage,
  QModal,
  QTabs,
  QTab,
  QTable,
  QBtn,
  QTd,
  QCard,
  QCardTitle,
  QCardMain,
  QTabPane,
  QModalLayout,
  QToolbar,
  QToolbarTitle,
  QIcon
} from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import { getTimeFromTrade } from '../utils/util'
import { convertFee } from '../utils/asch'

export default {
  props: [],
  components: {
    QPage,
    QModal,
    QTabs,
    QTab,
    QTable,
    QBtn,
    QTd,
    QCard,
    QCardTitle,
    QCardMain,
    QTabPane,
    QModalLayout,
    QToolbar,
    QToolbarTitle,
    QIcon
  },
  data() {
    return {
      selectedTab: 'supporters',
      // below are come from support
      datas: [],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      filter: '',
      loading: false,
      columns: this.dynamicCol,
      dialogShow: false,
      dialog: {
        title: '',
        message: ''
      },
      secondPwd: '',
      supports: [],
      user: {},
      agentWeight: 0
    }
  },
  methods: {
    ...mapActions(['getAgentSupporters', 'getAgentVotes', 'getAccountsInfo']),
    refresh() {
      this.pagination = this.paginationDeafult
      this.getDatas()
    },
    viewAccountInfo(row, isRecord = false) {
      if (isRecord) {
        this.$root.$emit('openAccountModal', row.address)
      }
      this.$root.$emit('openAccountModal', row.account.address)
    },
    async request(props) {
      if (this.userInfo) await this.getDatas(props.pagination, props.filter)
    },
    async getDatas(pagination = {}, filter = '') {
      this.loading = true
      let res = {}
      if (this.selectedTab === 'records') {
        res = await this.getAgentVotes({
          name: this.user.account.agent
        })
        if (res.success) this.datas = res.delegates
      } else {
        res = await this.getAgentSupporters({
          name: this.user.account.agent || this.user.account.name
        })
        if (res.success) this.datas = res.clienteles
      }

      // set max
      // this.pagination.rowsNumber = res.delegates.length
      this.loading = false
      return res
    },
    showContent(obj, content, isRecord = false) {
      if (isRecord) {
        return obj[content]
      }
      return obj.account[content]
    },
    showEndTime(obj) {
      return getTimeFromTrade({
        tTimestamp: obj.t_timestamp,
        tHeight: obj.t_height,
        endHeight: obj.account.lockHeight
      })
    },
    showTime(obj) {
      return obj.t_timestamp
    },
    showName(obj, isRecord = false) {
      if (isRecord) {
        return obj.name || obj.address
      }
      return obj.account.name || obj.account.address
    },
    async getAgentInfo() {
      console.log('trust me there')
      if (this.userInfo.account.agent) {
        let res = await this.getAccountsInfo({
          address: this.userInfo.account.agent
        })
        this.agentWeight = convertFee(res.account.agentWeight, 8)
      }
      if (this.userInfo.account.isAgent === 1) {
        this.agentWeight = convertFee(this.userInfo.account.agentWeight, 8)
      }
    }
  },
  mounted() {
    this.getAgentInfo()
    let { user } = this.$route.params
    if (!user || !user.account) {
      this.$router.push('/vote')
      return null
    }
    this.user = user
    if (user && user.account && user.account.agent) {
      this.getDatas()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    dynamicCol() {
      if (this.selectedTab === 'records') {
        return [
          {
            name: 'delegate',
            label: this.$t('VOTED_DELEGATE'),
            field: 'address',
            align: 'center'
          },
          // {
          //   name: 'voteWeight',
          //   label: this.$t('VOTE_WEIGHT'),
          //   field: 'username',
          //   type: 'string'
          // },
          // {
          //   name: 'weight',
          //   label: this.$t('WEIGHT'),
          //   field: 'address'
          // },
          {
            name: 'voteTime',
            label: this.$t('VOTE_TIME'),
            field: 'productivity'
          }
        ]
      } else {
        return [
          {
            name: 'name',
            label: this.$t('AUTHORIZOR'),
            field: 'name',
            align: 'center'
          },
          {
            name: 'xas',
            label: this.$t('AUTHORIZED_AMOUNT'),
            field: 'xas',
            type: 'string'
          },
          {
            name: 'lockHeight',
            label: this.$t('LOCK_TIME'),
            field: 'lockHeight'
          },
          {
            name: 'agent',
            label: this.$t('AUTHOR_TIME'),
            field: 'agent'
          }
        ]
      }
    },
    btnInfo() {
      if (this.isSetAgent) {
        return 'VOTE_CANCEL'
      } else {
        return 'VOTE_SET'
      }
    },
    paginationDeafult() {
      return {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      }
    },
    userAccount() {
      if (this.user && this.user.account) {
        return this.user.account
      }
    }
  },
  watch: {
    selectedTab(val) {
      this.datas = []
      this.getDatas()
    },
    userInfo() {
      if (this.userAccount) this.getDatas()
      if (this.userInfo && this.userInfo.account && this.userInfo.account.agent) {
        this.getAgentInfo()
      }
      if (this.userInfo && this.userInfo.account && this.userInfo.account.isAgent === 1) {
        this.getAgentInfo()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
