<template>
  <q-page class="proposal-container ">
    <!-- <div class="geteway-top">
      <i class="material-icons vertical-align-middle font-30 text-secondary">person</i>
      <span class="font-20 text-black vertical-align-middle">{{$t('PROPOSAL')}}</span>
    </div> -->
    <div class="proposal-content bg-white shadow-2 border-r-6">
      <div class="flex justify-between items-center">
        <div>
          <q-btn :class="proposalBtnClass" flat :label="$t('CONTRACT_LIST')" @click="changeState(1)" />
          <q-btn :class="proposalBtnClass" flat :label="$t('MY_CONTRACT')" @click="changeState(0)" />
        </div>
        <div class="">
          <q-input v-if="activatedState" ref="search" class="" v-model="filter" @keyup.enter="search" :after="searchIcon" type="text" :placeholder="$t('SEARCH_BY_CONTRACT_NAME')" hide-underline @clear="resetSearch()"/>
          <q-btn v-else class="font-14 new-launch" size="sm" color="secondary" :label="$t('SUBMIT_CONTRACT')" @click="newContract"></q-btn>
        </div>
      </div>
      <q-table class="no-shadow margin-t-20" :data="contracts" :columns="columns" row-key="no" :pagination.sync="pagination" @request="request" :rows-per-page-options="[10]">
        <q-td slot="body-cell-name" slot-scope="props" :props="props">
            <div class="light-paragraph" @click="open(props.value)">{{props.value}}</div>
        </q-td>
        <q-td slot="body-cell-desc" slot-scope="props" :props="props">
          {{props.value.substring(0,20) + '...'}}
          <q-popover v-if="props.value" ref="popover-msg">
            <div class="light-paragraph">{{props.value}}</div>
          </q-popover>
        </q-td>
        <q-td slot="body-cell-address" slot-scope="props" :props="props">
          <div @click="open(props.row.name)">
            {{props.value && props.value.substring(0, 7)}}
          </div>
          <q-popover v-if="props.value" ref="popover-msg">
            <div class="light-paragraph">{{props.value}}</div>
          </q-popover>
        </q-td>
      </q-table>
    </div>
  
  </q-page>
</template>

<script>

import { QPage, QBtnGroup, QTable, QTd, QBtn, QPopover, QInput } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import { } from '../utils/util'

export default {
  name: 'Contract',
  components: {
    QPage,
    QBtnGroup,
    QTable,
    QTd,
    QBtn,
    QPopover,
    QInput
  },
  data() {
    return {
      searchStr: '',
      loading: false,
      filter: '',
      // get infos filter
      activatedState: 1,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      contracts: [],
      columns: [
        {
          name: 'address',
          required: true,
          label: this.$t('ADDRESS'),
          align: 'center',
          field: 'address'
        },
        {
          name: 'name',
          required: true,
          label: this.$t('CONTRACT_NAME'),
          align: 'center',
          field: 'name'
        },
        {
          name: 'version',
          required: true,
          label: this.$t('VERSION'),
          align: 'center',
          field: 'version'
        },
        {
          name: 'owner',
          required: true,
          label: this.$t('OWNER'),
          align: 'center',
          field: 'owner'
        },
        {
          name: 'desc',
          required: true,
          label: this.$t('DESCRIBE'),
          align: 'center',
          field: 'desc'
        }
      ],
      // modal set
      isLaunchShow: false,
      isDetailShow: false,
      btnStatus: 1
    }
  },
  methods: {
    ...mapActions(['getProposals']),
    async getProposalsFunc(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      let limit = this.pagination.rowsPerPage
      let pageNo = this.pagination.page
      let condition = {
        limit: limit,
        offset: (pageNo - 1) * limit
      }
      if (filter) condition.name = filter
      if (this.activatedState === 0) condition.owner = this.user.account.address
      let res = await this.getProposals(condition)
      this.contracts = res.proposals
      this.pagination.rowsNumber = res.count
      this.loading = false
      return res
    },
    async request(props) {
      await this.getProposalsFunc(props.pagination, props.filter)
    },

    changeState(val) {
      this.activatedState = val
      this.getProposalsFunc()
    },
    callModal() {
      this.$router.push({
        name: 'launchProposal'
      })
    },
    open(name) {
      this.$router.push({
        name: 'contractDetail',
        params: {
          name: name
        }
      })
      // this.isDetailShow = true
    },
    search() {
      if (this.filter) this.getProposalsFunc({}, this.filter)
    },
    newContract() {
      this.$router.push('newContract')
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    proposalBtnClass() {
      return this.isDesk ? 'font-18 proposal-content-top-btn' : 'font-12 proposal-content-top-btn'
    },
    searchIcon() {
      const deleteIcon = {
        icon: 'close',
        // required function to call when
        // icon is clicked/tapped
        handler: () => (this.filter = ''),
        // Optional. Show icon button
        // if model has a value
        content: true
      }
      const searchIcon = {
        icon: 'search',
        // required function to call when
        // icon is clicked/tapped
        handler: () => this.search(),
        // Optional. Show icon button
        // if model has a value
        content: true
      }
      return this.filter ? [deleteIcon, searchIcon] : [searchIcon]
    },
    user() {
      return this.userInfo
    }
  },
  mounted() {
    this.getProposalsFunc()
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
.proposal-container {
  padding: 20px;
}

.geteway-top {
  margin-bottom: 20px;
}

.proposal-content {
  padding: 20px;
}

.proposal-content-top-btn:hover {
  color: #43aea8 !important;
}

.proposal-content-top-btn:hover {
  color: #000000;
}

.new-launch {
  min-height: 0;
}

.light-paragraph {
  word-break: break-all;
  max-width: 400px;
}
</style>
