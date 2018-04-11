
<template>
  <q-modal content-classes="row justify-center" v-model="show" maximized :no-esc-dismiss="true">
    <q-tabs v-model="selectedTab" no-pane-border inverted class="tab-container shadow-1" align="justify">
      <q-tab default name="supporters" slot="title"  icon="people" :label="$t('AGENT_VOTE_DETAIL')" />
      <q-tab name="records" slot="title" icon="face" :label="$t('AGENT_VOTE_RECORDS')" />
    </q-tabs>
    <div calss="col-8">
       <!-- come from VR page -->
       <q-table :no-data-label="$t('table.noData')" :data="datas" :filter="filter" color="primary"
        :columns="dynamicCol"  @request="request" :pagination.sync="pagination" row-key="id"
        :loading="loading" :rows-per-page-options="[10]"
        >
          <template slot="top-right" slot-scope="props">
            <q-btn flat round  icon="refresh" color="primary" @click="refreshVR" />
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
    <div class="col-3">
      <q-card>
        <q-card-title>
          {{$t('AGENT_DETAIL')}}
        </q-card-title>
        <q-card-main>
          <div>
            {{user.account.agent}}
          </div>
          <div>
            {{$t('AGENT_WEIGHT')}}({{user.account.agentWeightRatio}})%
          </div>
          <div>
            ({{user.account.agentWeight}})
          </div>
          
        </q-card-main>
      </q-card>
    </div>
  </q-modal>
</template>

<script>
import { QModal, QTabs, QTab, QTable, QBtn, QTd, QCard, QCardTitle, QCardMain } from 'quasar'
import { mapActions } from 'vuex'

export default {
  props: ['user'],
  components: {
    QModal,
    QTabs,
    QTab,
    QTable,
    QBtn,
    QTd,
    QCard,
    QCardTitle,
    QCardMain
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
      supports: []
    }
  },
  methods: {
    ...mapActions(['']),
    refresh() {
      this.pagination = this.paginationDeafult
      this.getDatas()
    },
    async request(props) {
      await this.getDatas(props.pagination, props.filter)
    },
    async getDatas(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let res = {}
      if (this.selectedTab === 'records') {
        res = await this.votetome({
          publicKey: this.user.account.publicKey,
          orderBy: 'rate:desc',
          limit: limit,
          offset: (pageNo - 1) * limit
        })
        this.datas = res.records
      } else {
        res = await this.votetome({
          publicKey: this.user.account.publicKey,
          orderBy: 'rate:desc',
          limit: limit,
          offset: (pageNo - 1) * limit
        })
        this.datas = res.supports
      }

      // set max
      this.pagination.rowsNumber = res.accounts.length
      this.loading = false
      return res
    }
  },
  computed: {
    dynamicCol() {
      if (this.selectedTab === 'records') {
        return [
          {
            name: 'delegate',
            label: this.$t('VOTED_DELEGATE'),
            field: 'rate',
            align: 'center'
          },
          {
            name: 'voteWeight',
            label: this.$t('VOTE_WEIGHT'),
            field: 'username',
            type: 'string'
          },
          {
            name: 'weight',
            label: this.$t('WEIGHT'),
            field: 'address'
          },
          {
            name: 'voteTime',
            label: this.$t('VOTE_TIME'),
            field: 'productivity'
          }
        ]
      } else {
        return [
          {
            name: 'authorizor',
            label: this.$t('AUTHORIZOR'),
            field: 'rate',
            align: 'center'
          },
          {
            name: 'authorizedAmount',
            label: this.$t('AUTHORIZED_AMOUNT'),
            field: 'username',
            type: 'string'
          },
          {
            name: 'weight',
            label: this.$t('WEIGHT'),
            field: 'address'
          },
          {
            name: 'lockTime',
            label: this.$t('LOCK_TIME'),
            field: 'productivity'
          },
          {
            name: 'authorTime',
            label: this.$t('AUTHOR_TIME'),
            field: 'productivity'
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
    }
  },
  watch: {
    selectedTab(val) {
      this.getDatas()
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
