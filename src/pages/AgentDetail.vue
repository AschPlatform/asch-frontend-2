
<template>
  <q-page :class="agentDetailClass">
    <div v-if="userAccount" :class="agentDetailContentClass">
      <div :class="agentDetailTitleClass">
        <div>
        <i class="material-icons vertical-align-middle font-24 text-secondary">perm_identity</i>
        <span class="font-24 vertical-align-middle font-weight">{{$t('AGENT_DETAIL')}}</span>
        </div>
        <q-btn color="secondary" slot="right" class="row items-center" @click="back">
          <q-icon name="reply" />
        </q-btn>
      </div>
  
      <q-card v-if="userAccount" class="desktop-hide col-md-3 padding-20 col-xs-12 margin-t-15 no-shadow">
        <div class="shadow-2 bg-white">
          <q-card-title class="bg-nine text-black font-22 height-62">
            {{$t('AGENT_DETAIL')}}
          </q-card-title>
          <q-card-main class="padding-20" align="center">
            <div class="text-secondary font-30 margin-t-20 break-word">
              {{user.account.agent || user.account.name}}
            </div>
            <div>
              <span class="font-16 text-black vertical-align-middle">{{$t('AGENT_WEIGHT')+':'}}</span>
              <span class="font-30 text-secondary vertical-align-middle">{{agentWeight}}</span>
            </div>
          </q-card-main>
        </div>
      </q-card>
  
      <q-card class="col-md-9 col-xs-12 no-shadow">
        <q-card-main v-if="userInfo">
          <q-tabs v-model="selectedTab" no-pane-border inverted class="tab-container shadow-1 col-9 " align="right">
            <q-tab default name="supporters" slot="title" color="secondary" icon="people" :label="$t('AGENT_VOTE_DETAIL')" />
            <q-tab name="records" slot="title" icon="face" color="secondary" :label="$t('AGENT_VOTE_RECORDS')" />
            <div>
              <!-- come from VR page -->
              <q-table :no-data-label="$t('table.noData')" :data="datas" :filter="filter" color="secondary" :columns="dynamicCol" row-key="id" :loading="loading" :rows-per-page-options="[10]">
                <template slot="top-right" slot-scope="props">
                  <q-btn flat round  icon="refresh" color="secondary" @click="refresh" />
                </template>
          
          <q-td slot="body-cell-address"  slot-scope="props" :props="props">
            <div class="text-secondary vote-table-address-td" @click="viewAccountInfo(props.row)">
              {{props.value}}
            </div>
          </q-td>
          <q-td slot="body-cell-username" slot-scope="props" :props="props">
            <div>
              {{props.value}} <q-icon v-if="props.row.voted" name="check circle" color="positive"/>
            </div>
          </q-td>
          <q-td slot="body-cell-approval"  slot-scope="props" :props="props">
              {{(Number(props.value))+'%'}}
          </q-td>
          <q-td slot="body-cell-productivity"  slot-scope="props" :props="props">
              {{props.value+'%'}}
          </q-td>

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
            <!-- {{props.row}} -->
          </q-td>
          <q-td slot="body-cell-xas"  slot-scope="props" :props="props">
            {{showContent(props.row, 'weight') | fee(8)}}
          </q-td>
          <q-td slot="body-cell-agent"  slot-scope="props" :props="props">
            {{showTime(props.row) | time}}
          </q-td>
          <!-- vote record overview -->
          <q-td slot="body-cell-delegate"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="viewAccountInfo(props.row, true)">
              {{showName(props.row, true)}}
            </div>
          </q-td>
          <q-td slot="body-cell-voteTime"  slot-scope="props" :props="props">
            {{showTime(props.row) | time}}
          </q-td>
        </q-table>
    </div>
    </q-tabs>
      </q-card-main>
    </q-card>

    <q-card v-if="userAccount" class="mobile-hide col-md-3 col-xs-12 margin-t-15 no-shadow">
      <div class="shadow-2 bg-white">
      <q-card-title class="bg-nine text-black font-22 height-62">
        {{$t('VOTE_DELEGATE_DETAIL')}}
      </q-card-title>
      <q-card-main class="padding-20" align="center">
        <div class="text-secondary font-30 margin-t-20 break-word">
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
import { getTimeFromEndHeight } from '../utils/util'
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
    back() {
      this.$router.back()
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
          name: this.user.account.agent || this.user.account.name
        })
        if (res.success) this.datas = res.delegates
      } else {
        res = await this.getAgentSupporters({
          name: this.user.account.agent || this.user.account.name
        })
        if (res.success) this.datas = res.clienteles
      }

      // set max
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
      return getTimeFromEndHeight({
        endHeight: obj.account.lockHeight,
        currentHeight: this.latestBlock.height
      })
    },
    showTime(obj) {
      return obj.timestamp
    },
    showName(obj, isRecord = false) {
      if (isRecord) {
        return obj.name || obj.address
      }
      return obj.account.name || obj.account.address
    },
    async getAgentInfo() {
      let that = this
      if (this.userInfo.account.agent) {
        let res = await this.getAccountsInfo({
          address: that.userInfo.account.agent
        })
        this.agentWeight = convertFee(res.account.agentWeight, 8)
      }
      if (this.userInfo.account.isAgent === 1) {
        this.agentWeight = convertFee(this.userInfo.account.agentWeight, 8)
      }
    }
  },
  mounted() {
    let { user } = this.$route.params
    if (!user || !user.account) {
      this.$router.push('/vote')
      return null
    }
    this.user = user
    if (user && user.account && user.account.agent) {
      this.getDatas()
    }
    this.getAgentInfo()
  },
  computed: {
    ...mapGetters(['userInfo', 'latestBlock']),
    agentDetailClass() {
      return this.isDesk ? 'padding-20 border-r-6' : 'border-r-6'
    },
    agentDetailContentClass() {
      return this.isDesk ? 'row padding-10 bg-white' : 'row bg-white'
    },
    agentDetailTitleClass() {
      return this.isDesk ? 'row justify-between col-12 padding-l-15 margin-top-20' : 'row justify-between col-12 padding-l-15 padding-right-20 margin-top-20'
    },
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
            name: 'address',
            label: this.$t('ADDRESS'),
            field: 'address'
          },
          {
            name: 'productivity',
            label: this.$t('PRODUCTIVITY'),
            field: 'productivity'
          },
          {
            name: 'producedblocks',
            label: this.$t('PRODUCED_BLOCKS'),
            field: 'producedblocks',
            align: 'center',
            type: 'number'
          },
          {
            name: 'approval',
            label: this.$t('APPROVAL'),
            field: 'approval'
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
  .break-word
    word-break break-word
</style>
