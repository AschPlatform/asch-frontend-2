<template>
  <q-tabs no-pane-border inverted class="tab-container shadow-1" align="justify">
    <q-tab default name="voteRecords" slot="title"  icon="people" :label="$t('VOTE_RECORD')" />
    <q-tab name="supporters" slot="title" icon="face" :label="$t('MY_VOTERS')" />
    <!-- target -->
    <q-tab-pane name="voteRecords" keep-alive>
       <!-- come from VR page -->
       <q-table :no-data-label="$t('table.noData')" :data="VR.delegatesData" :filter="VR.filter" color="primary"
        selection="multiple" :selected.sync="VR.selected" row-key="address"
        :columns="VR.columns"  @request="requestVR" :pagination.sync="VR.pagination" 
        :loading="VR.loading" :rows-per-page-options="[10]"
        >
        
          <template slot="top-right" slot-scope="props">
            <q-btn v-if="VR.selected.length" color="negative" flat round  icon="delete" @click="repeal" >
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('TRS_TYPE_VOTE')}}</q-tooltip>
            </q-btn>
            <q-btn flat round  icon="refresh" color="primary" @click="refreshVR" >
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
    </q-tab-pane>
    <q-tab-pane name="supporters" keep-alive>
        <q-table :no-data-label="$t('table.noData')" :data="SP.supports" :filter="SP.filter" color="primary"
        :columns="SP.columns"  @request="requestSP" :pagination.sync="SP.pagination" 
        :loading="SP.loading" :title="$t('TOTAL_PEOPLES',{count:SP.pagination.rowsNumber})"
        >
        
          <template slot="top-right" slot-scope="props">
            <q-btn flat round  icon="refresh" color="primary" @click="refreshSP" >
            </q-btn>
            <q-btn flat round  color="primary" :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" >
            </q-btn>
          </template>
           
          <q-td slot="body-cell-address"  slot-scope="props" :props="props">
            <div @click="viewAccountInfo(props.row)" class="text-primary">{{props.value}}</div>
          </q-td>

          <q-td slot="body-cell-weight"  slot-scope="props" :props="props">
            <div>{{props.value.toFixed(3)}}</div>
          </q-td>
        </q-table>
    </q-tab-pane>
    <q-dialog v-model="VR.dialogShow" prevent-close @ok="onOk" @cancel="onCancel">

      <span slot="title">{{$t('DELETE_VOTE_TITLE')}}</span>
      <span slot="message">{{$t('DELETE_VOTE_TIP')}}
        <br/>
        {{$t('OPERATION_REQUIRES_FEE')+'0.1 XAS'}}</span>
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
            <tr v-for="delegate in VR.selected" :key="delegate.address">
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
    <slot name="voteDelegate"></slot>
  </q-tabs>
</template>

<script>
import { translateErrMsg } from '../utils/api'
import { QTabs, QTab, QTabPane } from 'quasar'
import { toast } from '../utils/util'
import { createVote } from '../utils/asch'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['userObj'],
  components: {
    QTabs,
    QTab,
    QTabPane,
    mapGetters
  },
  data() {
    return {
      SP: {
        // below are come from support
        delegates: [],
        pagination: {
          page: 1,
          rowsNumber: 0,
          rowsPerPage: 10
        },
        filter: '',
        loading: false,
        columns: [
          {
            name: 'address',
            field: 'address',
            label: this.$t('ADDRESS'),
            align: 'center'
          },
          {
            name: 'weight',
            label: this.$t('WEIGHT'),
            field: 'weight',
            align: 'left'
          }
        ],
        dialogShow: false,
        dialog: {
          title: '',
          message: ''
        },
        secondPwd: '',
        supports: []
      },
      VR: {
        delegatesData: [],
        pagination: {
          page: 1,
          rowsNumber: 0,
          rowsPerPage: 10
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
          // {
          //   name: 'rate',
          //   label: this.$t('RANKING'),
          //   field: 'rate',
          //   align: 'center'
          // },
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
          }
          // {
          //   name: 'productivity',
          //   label: this.$t('PRODUCTIVITY'),
          //   field: 'productivity'
          // },
          // {
          //   name: 'producedblocks',
          //   label: this.$t('PRODUCED_BLOCKS'),
          //   field: 'producedblocks',
          //   align: 'center',
          //   type: 'number'
          // },
          // {
          //   name: 'approval',
          //   label: this.$t('APPROVAL'),
          //   field: 'approval'
          // }
        ],
        dialogShow: false,
        dialog: {
          title: '',
          message: ''
        },
        secondPwd: ''
      }
    }
  },
  methods: {
    ...mapActions(['votetome', 'myvotes', 'broadcastTransaction']),
    // come from SP PAGE
    refreshSP() {
      this.SP.pagination = this.paginationDeafult
      this.getSupporters()
    },
    async requestSP(props) {
      await this.getSupporters(props.pagination, props.filter)
    },
    async getSupporters(pagination = {}, filter = '') {
      this.SP.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.SP.pagination.rowsPerPage
      let pageNo = this.SP.pagination.page
      let res = await this.votetome({
        publicKey: this.user.account.publicKey,
        orderBy: 'rate:asc',
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      this.SP.supports = res.accounts
      // set max
      this.SP.pagination.rowsNumber = res.accounts.length
      this.SP.loading = false
      return res
    },
    viewAccountInfo(row) {
      this.$root.$emit('openAccountModal', row.address)
    },
    // come from VR page
    refreshVR() {
      this.VR.pagination = this.paginationDeafult
      this.getDelegates()
    },
    async requestVR(props) {
      await this.getDelegates(props.pagination, props.filter)
    },
    async getDelegates(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.VR.pagination = pagination
      let limit = this.VR.pagination.rowsPerPage
      let pageNo = this.VR.pagination.page
      let res = await this.myvotes({
        address: this.user.account.address,
        orderBy: 'rate:asc',
        limit: limit,
        offset: (pageNo - 1) * limit
      })
      if (res.success) {
        this.VR.delegatesData = res.delegates
      } else {
        this.VR.delegatesData = []
      }
      // set max
      this.VR.pagination.rowsNumber = res.totalCount
      this.VR.loading = false
      return res
    },
    info(msg) {
      toast(msg)
    },
    async onOk() {
      if (this.selectedDelegate.length === 0) {
        this.VR.selected = []
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
    repeal() {
      this.VR.dialogShow = true
    }
  },
  mounted() {
    if (this.user) {
      this.getSupporters()
      this.getDelegates()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    },
    paginationDeafult() {
      return {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      }
    },
    selectedDelegate() {
      let selected = this.VR.selected.filter(d => {
        return !d.voted
      })
      return selected.map(delegate => {
        return '-' + delegate.publicKey
      })
    },
    secondSignature() {
      return this.user ? this.user.account.secondSignature : null
    }
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.getSupporters()
        this.getDelegates()
      }
    },
    pageNo(val) {
      this.getSupporters()
    }
  }
}
</script>

<style lang="stylus">
pd-5 {
  padding: 5%;
}
