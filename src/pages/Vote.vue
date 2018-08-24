<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <q-page class="vote-container">
    <div class="geteway-top">
      <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
      <span class="font-20 text-black vertical-align-middle">{{$t('TRS_TYPE_VOTE')}}</span>
    </div>
    <div class="row vote-content bg-white">
      <div class="col-md-8 col-xs-12 no-shadow bg-white">
        <q-table :data="delegatesData" :filter="filter" color="secondary" selection="multiple" :selected.sync="selected" row-key="address" :columns="columns" @request="request" :pagination.sync="pagination" :loading="loading" :title="$t('DELEGATE_LIST')" :rows-per-page-options="[10]">
  
          <template slot="top-right" slot-scope="props">
              <q-btn v-if="selected.length" color="secondary" flat round  icon="thumb up" @click="vote" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('TRS_TYPE_VOTE')}}</q-tooltip>
              </q-btn>
              <q-btn flat round  icon="refresh" color="secondary" @click="refresh" >
              </q-btn>
              <q-btn flat round  color="secondary" :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" >
              </q-btn>
          </template>
              
            <q-td slot="body-cell-address"  slot-scope="props" :props="props">
              <div class="text-secondary vote-table-address-td" @click="viewAccountInfo(props.row)">
                {{props.value}}
              </div>
            </q-td>
            <q-td slot="body-cell-username" slot-scope="props" :props="props">
              <div>
                {{props.row.name}} <q-icon v-if="props.row.voted" name="check circle" color="positive"/>
              </div>
            </q-td>
            <q-td slot="body-cell-approval"  slot-scope="props" :props="props">
                {{props.value | approval}}
            </q-td>
            <q-td slot="body-cell-productivity"  slot-scope="props" :props="props">
                {{props.value+'%'}}
            </q-td>
          </q-table>
        </div>

        <div :class="voteRightClass">
          <div>
          <vote-record />
          <my-vote-delegate class="margin-t-20" :user="userInfo" @setAgent="setAgent" @repealAgent="repealAgent" @openDetail="agentDetail" />
          </div> 
        </div>

    </div>
      <q-dialog v-model="dialogShow" prevent-close @ok="onOk" @cancel="onCancel">

      <span slot="title">{{$t('VOTE_TITLE')}}</span>
      <span slot="message">{{$t('VOTE_TIP')}}
        <br/>
        {{$t('OPERATION_REQUIRES_FEE')+'0.1 XAS'}}
      </span>
        <div slot="body">
          <q-field class="q-mb-lg" v-if="secondSignature"
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
          <q-btn flat color="secondary" :label="$t('label.cancel')" @click="props.cancel" />
          <q-btn flat color="secondary" :label="$t('label.ok')" @click="props.ok" />
        </template>
      </q-dialog>
  </q-page>
</template>

<script>
import {
  QTabs,
  QRouteTab,
  QPage,
  QTab,
  QTabPane,
  QIcon,
  QTable,
  QTd,
  QBtn,
  QField,
  QInput,
  QTooltip
} from 'quasar'
import { toast, toastWarn, translateErrMsg, prompt } from '../utils/util'
// import { createVote } from '../utils/asch'
import asch from '../utils/asch'
import { mapActions, mapGetters } from 'vuex'
import VoteRecord from '../components/VoteRecord'
import MyVoteDelegate from '../components/MyVoteDelegate'
import { secondPwdReg } from '../utils/validators'

export default {
  props: [],
  components: {
    QTooltip,
    QTabs,
    QRouteTab,
    QPage,
    QTab,
    QTabPane,
    VoteRecord,
    MyVoteDelegate,
    QIcon,
    QTable,
    QBtn,
    QTd,
    QField,
    QInput
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
      secondPwd: ''
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
      this.selected = []
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
      if (this.selectedDelegate.length > 33) {
        toastWarn(this.$t('ERR.NO_MORE_THAN_33'))
        return
      }
      let trans = asch.voteDelegate(
        this.selectedDelegate.join(','),
        this.userInfo.secret,
        this.secondPwd
      )
      let res = await this.broadcastTransaction(trans)
      if (res.success === true) {
        this.selected = []
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
      this.dialogShow = true
    },
    async setAgent(params, cb = () => {}) {
      let trans = asch.setAgent(params.agent, this.userInfo.secret, params.secondPwd)
      let res = await this.broadcastTransaction(trans)
      if (res.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        cb()
      } else {
        translateErrMsg(this.$t, res.error)
      }
    },
    async repealAgent() {
      const t = this.$t
      if (this.secondSignature) {
        prompt(
          {
            title: t('REGISTER_AGENT'),
            message: t('ACCOUNT_TYPE2_HINT'),
            prompt: {
              model: '',
              type: 'password' // optional
            }
          },
          data => {
            if (!data || !secondPwdReg.test(data)) {
              toastWarn(t('ERR_SECOND_PASSWORD_FORMAT'))
            } else {
              this.submitRepeal(data)
            }
          }
        )
      } else {
        this.submitRepeal()
      }
    },
    async submitRepeal(secondPwd = '') {
      let trans = asch.repealAgent(this.userInfo.secret, secondPwd)
      let res = await this.broadcastTransaction(trans)
      if (res.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
      } else {
        translateErrMsg(this.$t, res.error)
      }
    },
    agentDetail() {
      this.$router.push({
        name: 'agentDetail',
        params: {
          user: this.userInfo
        }
      })
    }
  },
  mounted() {
    if (this.userInfo) {
      this.getDelegates()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    secondSignature() {
      return this.userInfo ? this.userInfo.account.secondPublicKey : null
    },
    voteRightClass() {
      return this.isDesk
        ? 'col-md-4 col-xs-12 vote-right-container'
        : 'col-md-4 col-xs-12 margin-t-20'
    },
    paginationDeafult() {
      return {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 15
      }
    },
    selectedDelegate() {
      let selected = this.selected.filter(d => {
        return !d.voted
      })
      return selected.map(delegate => {
        return delegate.name
      })
    },
    // TODO: below are gonna
    isSetDelegate() {}
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.getDelegates()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.geteway-top {
  margin-bottom: 20px;
}

.vote-container {
  padding: 20px;
}

.vote-content {
  padding: 20px;
  border-radius: 6px;
}

.vote-line {
  display: block;
  width: 100%;
  height: 1px;
  background: #dddddd;
  margin: 25px 0 10px 0;
}

.vote-right-container {
  padding-left: 20px;
}

.vote-container-title {
  padding: 20px 0;
}

.vote-table-address-td {
  cursor: pointer;
}
</style>
