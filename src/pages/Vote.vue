<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <q-page class="row gutter-xs layout-padding">
        <div class="col-7 shadow-1">
          <q-table :data="delegatesData" :filter="filter" color="primary"
          selection="multiple" :selected.sync="selected" row-key="address"
          :columns="columns"  @request="request" :pagination.sync="pagination" 
          :loading="loading" :title="$t('DELEGATE_LIST')"
          :rows-per-page-options="[15]"
          >
          
            <template slot="top-right" slot-scope="props">
              <q-btn v-if="selected.length" color="positive" flat round  icon="thumb up" @click="vote" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('TRS_TYPE_VOTE')}}</q-tooltip>
              </q-btn>
              <q-btn flat round  icon="refresh" color="primary" @click="refresh" >
              </q-btn>
              <q-btn flat round  color="primary" :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" >
              </q-btn>
            </template>
              
            <q-td slot="body-cell-address"  slot-scope="props" :props="props">
              <div class="text-primary" @click="viewAccountInfo(props.row)">
                {{props.value}}
              </div>
            </q-td>
            <q-td slot="body-cell-username" slot-scope="props" :props="props">
              <div>
                {{props.value}} <q-icon v-if="props.row.voted" name="check circle" color="positive"/>
              </div>
            </q-td>
          </q-table>
        </div>

        <div class="col-5">
          <vote-record />
          <my-vote-delegate slot="voteDelegate" :user="userInfo" @setAgent="setAgent" @repealAgent="repealAgent" @openDetail="agentDetailModalShow = true" />
        </div>

        <q-dialog v-model="dialogShow" prevent-close @ok="onOk" @cancel="onCancel">

        <span slot="title">{{$t('VOTE_TITLE')}}</span>
        <span slot="message">{{$t('VOTE_TIP')}}
          <br/>
          {{$t('OPERATION_REQUIRES_FEE')+'0.1 XAS'}}
        </span>
          <div slot="body">
            <q-field v-if="secondSignature"
              :label="$t('TRS_TYPE_SECOND_PASSWORD')"
              :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"
              :label-width="4"
            >
              <q-input v-model="secondPwd" type="password" />
            </q-field>
          <table class="q-table horizontal-separator highlight loose ">
              <tbody class='info-tbody'>
                <tr>
                  <td >{{$t('DAPP_NAME')}}</td>
                  <td >{{$t('ADDRESS')}}</td>
                </tr>
                <tr v-for="delegate in selected" :key="delegate.address">
                  <td >{{delegate.name}} <q-icon v-if="delegate.voted" name="check circle" color="positive"/></td>
                  <td >{{delegate.address}} </td>
                </tr>
              </tbody>
            </table>
            </div>
          <template slot="buttons" slot-scope="props">
            <q-btn  flat color="primary" :label="$t('label.cancel')" @click="props.cancel" />
            <q-btn  flat color="primary" :label="$t('label.ok')" @click="props.ok" />
          </template>
        </q-dialog>
    <!-- this should review -->
    
    <agent-detail-modal :agent="user.account.agent" :show="agentDetailModal" />
    <!-- <router-view class="col-5" :userObj="userObj"></router-view> -->
  </q-page>
</template>

<script>
import { QTabs, QRouteTab, QPage, QTab, QTabPane } from 'quasar'
import { translateErrMsg } from '../utils/api'
import { toast, toastWarn } from '../utils/util'
// import { createVote } from '../utils/asch'
import asch from '../utils/asch-v2'
import { mapActions, mapGetters } from 'vuex'
import voteRecord from '../components/voteRecord'
import myVoteDelegate from '../components/myVoteDelegate'
import AgentDetailModal from '../components/AgentDetailModal'

export default {
  props: ['userObj'],
  components: {
    QTabs,
    QRouteTab,
    QPage,
    QTab,
    QTabPane,
    voteRecord,
    myVoteDelegate,
    AgentDetailModal
  },
  data() {
    return {
      // below are original data from supporters
      delegatesData: [],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 15
      },
      selected: [],
      filter: '',
      loading: false,
      columns: [
        {
          name: 'rate',
          label: this.$t('RANKING'),
          field: 'rate',
          align: 'center'
        },
        {
          name: 'username',
          label: this.$t('DELEGATE'),
          field: 'name',
          type: 'string'
        },
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
      ],
      dialogShow: false,
      dialog: {
        title: '',
        message: ''
      },
      secondPwd: '',
      agentDetailModal: true
    }
  },
  methods: {
    ...mapActions(['delegates', 'broadcastTransaction']),
    routerConfig(name) {
      return {
        name: name,
        params: {
          user: this.user
        }
      }
    },
    // below are original funcs
    refresh() {
      this.pagination = this.paginationDeafult
      this.getDelegates()
    },
    async request(props) {
      await this.getDelegates(props.pagination, props.filter)
    },
    async getDelegates(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = await this.delegates({
        address: this.user.account.address,
        orderBy: 'rate:asc',
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      this.delegatesData = res.delegates
      // set max
      this.pagination.rowsNumber = res.totalCount
      this.loading = false
      return res
    },
    viewAccountInfo(row) {
      this.$root.$emit('openAccountModal', row.address)
    },
    info(msg) {
      toast(msg)
    },
    async onOk() {
      if (this.selectedDelegate.length === 0) {
        this.selected = []
        return
      }
      let trans = asch.voteDelegate(this.selectedDelegate, this.user.secret, this.secondPwd)
      let res = await this.broadcastTransaction(trans)
      if (res.success === true) {
        toast(this.$t('INF_VOTE_SUCCESS'))
      } else {
        translateErrMsg(this.$t, res.error)
      }
      this.secondPwd = ''
    },
    onCancel() {
      this.secondPwd = ''
    },
    vote() {
      if (this.user.account.isLocked === 0) {
        toastWarn(this.$t('PLEASE_LOCK'))
        return
      }
      this.dialogShow = true
    },
    async setAgent(name, cb = () => {}) {
      let trans = asch.setAgent(name)
      let res = await this.broadcastTransaction(trans)
      if (res.success) {
        toast('INF_OPERATION_SUCCEEDED')
      } else {
        translateErrMsg(res.error, this.$t)
      }
    },
    async repealAgent() {
      let trans = asch.repealAgent(name)
      let res = await this.broadcastTransaction(trans)
      if (res.success) {
        toast('INF_OPERATION_SUCCEEDED')
      } else {
        translateErrMsg(res.error, this.$t)
      }
    }
  },
  mounted() {
    if (this.user) {
      this.getDelegates()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    },
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : null
    },
    paginationDeafult() {
      return {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      }
    },
    selectedDelegate() {
      let selected = this.selected.filter(d => {
        return !d.voted
      })
      return selected.map(delegate => {
        return '+' + delegate.publicKey
      })
    },
    // TODO: below are gonna
    isSetDelegate() {
      return false
    }
  },
  watch: {
    userInfo(val) {
      if (val && val.account.publicKey) {
        this.getDelegates()
      }
    }
  }
}
</script>

<style lang="stylus">
</style>
