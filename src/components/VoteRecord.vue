<template>
  <q-tabs no-pane-border inverted class="tab-container shadow-1" align="justify">
    <q-tab default name=""  color="secondary" slot="title" icon="people" @click="type = 1" :label="$t('VOTE_RECORD')" />
    <q-tab name="" color="secondary" slot="title" icon="face" @click="type = 2" :label="$t('MY_VOTERS')" />
    <!-- target -->
    <q-tab-pane class="padding-0" name="" keep-alive>
      <q-table :no-data-label="$t('table.noData')"
      :data="dataList"
      :filter="filter" color="secondary"
      :selection="selectionStatus"
      :selected.sync="selected" row-key="address"
      :columns="dynamicCol" @request="request"
      :pagination.sync="pagination"
      :loading="loading"
      :rows-per-page-options="[10]"
      :title="$t('TOTAL_PEOPLES',{count:totalNum})"
      >
  
        <template slot="top-right" slot-scope="props">
          <q-btn v-if="selected.length" color="negative" flat round  icon="delete" @click="repeal" >
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]">{{$t('CANCEL_VOTE')}}</q-tooltip>
          </q-btn>
          <q-btn flat round  icon="refresh" color="secondary" @click="refresh" >
          </q-btn>
          <q-btn flat round  color="secondary" :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" >
          </q-btn>
        </template>
           
          <q-td slot="body-cell-address"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="viewAccountInfo(props.row)">
              {{props.value.substring(0,7)}}
            </div>
          </q-td>
          <q-td slot="body-cell-address2"  slot-scope="props" :props="props">
            <div class="text-secondary" @click="viewAccountInfo(props.row)">
              {{props.value.substring(0,7)}}
            </div>
          </q-td>
          <q-td slot="body-cell-weight"  slot-scope="props" :props="props">
            <!-- {{props.row.weightRatio.toFixed(4)}} -->
            {{dueRatio(props.row)}}
          </q-td>
          <q-td slot="body-cell-username"  slot-scope="props" :props="props">
            <div>
              {{props.value}} <q-icon v-if="props.row.voted" name="check circle" color="positive"/>
            </div>
          </q-td>
        </q-table>
    </q-tab-pane>
    <q-dialog v-model="dialogShow" prevent-close @ok="onOk" @cancel="onCancel">

      <span slot="title">{{$t('DELETE_VOTE_TITLE')}}</span>
      <span slot="message">{{$t('DELETE_VOTE_TIP')}}
        <br/>
        {{$t('OPERATION_REQUIRES_FEE')+'0.1 XAS'}}</span>
      <div slot="body">
        <q-field v-if="secondSignature"
          :label="$t('TRS_TYPE_SECOND_PASSWORD')"
          :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"
          :label-width="4"
          class="q-mb-lg"
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
    <slot name="voteDelegate"></slot>
  </q-tabs>
</template>

<script>
import { QTable, QTabs, QTab, QTabPane, QIcon, QBtn, QField, QInput, QTooltip, QTd } from 'quasar'
import { toast, translateErrMsg } from '../utils/util'
import asch from '../utils/asch-v2'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['userObj'],
  components: {
    QTable,
    QTabs,
    QTab,
    QTabPane,
    mapGetters,
    QIcon,
    QBtn,
    QField,
    QInput,
    QTooltip,
    QTd
  },
  data() {
    return {
      // table type 1: vote record, 2: vote to me
      type: 1,
      // ------- below are new one
      dataList: [],
      filter: '',
      selected: [],
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      loading: false,
      dialogShow: false,
      secondPwd: ''
      // ------- below are old one
    }
  },
  methods: {
    ...mapActions(['votetome', 'myvotes', 'broadcastTransaction']),
    refresh() {
      this.pagination = this.paginationDeafult
      this.getData()
    },
    async request(props) {
      await this.getData(props.pagination, props.filter)
    },
    async getData(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res
      if (this.type === 1) {
        res = await this.myvotes({
          address: this.userInfo.account.address,
          orderBy: 'rate:asc',
          limit: limit,
          offset: (pageNo - 1) * limit
        })
        if (res.success) {
          this.dataList = res.delegates
          this.pagination.rowsNumber = res.delegates.length
        }
      } else {
        let result = []
        res = await this.votetome({
          name: this.userInfo.account.name,
          orderBy: 'rate:asc',
          limit: limit,
          offset: (pageNo - 1) * limit
        })
        if (res.success) {
          res.accounts.forEach(o => {
            if (o.isLocked === 1) {
              result.push(o)
            }
          })
          this.dataList = result
          this.pagination.rowsNumber = result.length
        }
      }
      this.loading = false
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
      let trans = asch.cleanVote(this.selectedDelegate, this.userInfo.secret, this.secondPwd)
      let res = await this.broadcastTransaction(trans)
      if (res.success === true) {
        toast(this.$t('RETREAT_VOTE_SUCCESS'))
      } else {
        translateErrMsg(this.$t, res.error)
      }
      this.secondPwd = ''
    },
    onCancel() {
      this.secondPwd = ''
    },
    repeal() {
      this.dialogShow = true
    },
    dueRatio(props) {
      if (props.weightRatio) {
        if (props.weightRatio < 0.0001) {
          return 0.0001 + '%'
        }
        return props.weightRatio.toFixed(4) + '%'
      }
    }
  },
  mounted() {
    if (this.userInfo) {
      this.getData()
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    paginationDeafult() {
      return {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      }
    },
    selectedDelegate() {
      // string, split by ','
      let selected = this.selected.filter(d => {
        return !d.voted
      })
      return selected
        .map(delegate => {
          return delegate.name
        })
        .join(',')
    },
    secondSignature() {
      return this.userInfo ? this.userInfo.account.secondPublicKey : null
    },
    dynamicCol() {
      // 1 for vote record, 2 for vote to me
      if (this.type === 1) {
        return [
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
          }
        ]
      } else {
        return [
          {
            name: 'address2',
            field: 'address',
            label: this.$t('ADDRESS'),
            align: 'center'
          },
          {
            name: 'weight',
            label: this.$t('WEIGHT'),
            field: 'weightRatio',
            align: 'left'
          }
        ]
      }
    },
    selectionStatus() {
      if (this.type === 1) {
        return 'multiple'
      }
      return 'none'
    },
    totalNum() {
      return this.pagination.rowsNumber
    }
  },
  watch: {
    userInfo(val) {
      if (val) {
        this.getData()
      }
    },
    type() {
      this.getData()
    }
  }
}
</script>

<style lang="stylus" scoped>
pd-5 {
  padding: 5%;
}
</style>


