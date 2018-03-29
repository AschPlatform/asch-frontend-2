<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <q-page class="row gutter-xs">
    <!-- <q-tabs inverted align="left"  class="tab-container col-7 shadow-1"> -->
      <!-- <q-tab default  name="delegates"  slot="title" icon="people outline" :label="$t('DELEGATE_LIST')" /> -->
      <!-- <q-route-tab name="voteRecords" :to="routerConfig('voteRecords')" slot="title"  icon="people" :label="$t('VOTE_RECORD')" />
      <q-route-tab name="supporters" slot="title" :to="routerConfig('supporters')" icon="face" :label="$t('MY_VOTERS')" /> -->
      <!-- <router-view :userObj="user" /> -->
      <!-- <div class="tab-panel-container row "> -->
        <div v-if="delegatesData" class="col-7 shadow-1">
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
            <q-td slot="body-cell-username"  slot-scope="props" :props="props">
              <div>
                {{props.value}} <q-icon v-if="props.row.voted" name="check circle" color="positive"/>
              </div>
            </q-td>
            <!-- <q-td slot="body-cell-opt"  slot-scope="props" :props="props">
              <q-btn @click="viewAccountInfo(props.row)" icon="remove red eye" size="sm" flat color="primary" >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('DAPP_DETAIL')}}</q-tooltip>
              </q-btn>
              <q-icon color="positive" v-if="props.row.voted" name="icon-chrome" />
            </q-td> -->
          </q-table>
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
                  <td >{{delegate.username}} <q-icon v-if="delegate.voted" name="check circle" color="positive"/></td>
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
      <!-- </div> -->
    <!-- </q-tabs> -->
    <!-- <q-tabs inverted class="tab-container col-4 shadow-1" align="justify">
      <q-route-tab name="voteRecords" :to="routerConfig('voteRecords')" slot="title"  icon="people" :label="$t('VOTE_RECORD')" />
      <q-route-tab name="supporters" slot="title" :to="routerConfig('supporters')" icon="face" :label="$t('MY_VOTERS')" />
      <router-view :userObj="userObj"></router-view>
    </q-tabs> -->
    <!-- this should review -->
    <vote-record class="col-5"></vote-record>
    <!-- <router-view class="col-5" :userObj="userObj"></router-view> -->
  </q-page>
</template>

<script>
import { QTabs, QRouteTab, QPage, QTab, QTabPane } from 'quasar'
import { translateErrMsg } from '../utils/api'
import { toast } from '../utils/util'
import { createVote } from '../utils/asch'
import { mapActions, mapGetters } from 'vuex'
import voteRecord from '../components/voteRecord'

export default {
  props: ['userObj'],
  data() {
    return {
      // below are original data from supporters
      delegatesData: null,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 15
      },
      selected: [],
      filter: '',
      loading: false,
      columns: [
        // {
        //   name: 'opt',
        //   field: 'rate',
        //   label: this.$t('OPERATION'),
        //   align: 'center'
        // },
        {
          name: 'rate',
          label: this.$t('RANKING'),
          field: 'rate',
          align: 'center'
        },
        {
          name: 'username',
          label: this.$t('DELEGATE'),
          field: 'username',
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
  components: {
    QTabs,
    QRouteTab,
    QPage,
    QTab,
    QTabPane,
    voteRecord
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
      let trans = createVote(this.selectedDelegate, this.user.secret, this.secondPwd)
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
      this.dialogShow = true
    }
  },
  async mounted() {
    if (this.user) {
      this.getDelegates()
    }
    console.log(this, 'user in vote')
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    },
    secondSignature() {
      return this.user ? this.user.account.secondSignature : null
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
    }
  },
  watch: {}
}
</script>

<style lang="stylus">
</style>
