<template>
  <q-page class="padding-20">
    <div class="proposal-content bg-white shadow-2 border-r-6">
      <q-btn-group class="desktop-hide float-right margin-bottom-10">
        <q-btn class="font-14 new-launch" size="sm" color="secondary" :label="$t('proposal.LAUNCH')" @click="callModal"></q-btn>
      </q-btn-group>
      <q-btn-group outline>
        <q-btn :class="proposalBtnClass" flat color="secondary" :label="$t('proposal.TITLE_ALL')" @click="changeState('all')" />
        <q-btn :class="proposalBtnClass" flat :label="$t('proposal.TITLE_PROCESS')" @click="changeState('ongoing')" />
        <q-btn :class="proposalBtnClass" flat :label="$t('proposal.TITLE_ACTIVED')" @click="changeState('activated')" />
        <q-btn :class="proposalBtnClass" flat :label="$t('proposal.TITLE_EXPIRED')" @click="changeState('expired')" />
      </q-btn-group>
      <q-btn-group class="mobile-hide float-right">
        <q-btn class="font-18" size="sm" color="secondary" :label="$t('proposal.LAUNCH')" @click="callModal"></q-btn>
      </q-btn-group>
  
      <q-table class="no-shadow margin-t-20" :data="proposalDetail" :columns="columns" row-key="no" :pagination.sync="pagination" @request="request">
        <q-td slot="body-cell-desc" slot-scope="props" :props="props">
          {{props.value.substring(0,20) + '...'}}
          <q-popover v-if="props.value" ref="popover-msg">
            <div class="light-paragraph">{{props.value.substring(0,50) + '...'}}</div>
          </q-popover>
        </q-td>
        <q-td slot="body-cell-tid" slot-scope="props" :props="props">
          {{props.value.substring(0, 7)}}
          <q-popover v-if="props.value" ref="popover-msg">
            <div class="light-paragraph">{{props.value}}</div>
          </q-popover>
        </q-td>
        <q-td slot="body-cell-topic" slot-scope="props" :props="props">
          {{transGate(props.value)}}
        </q-td>
        <q-td slot="body-cell-activated" slot-scope="props" :props="props">
          <q-btn flat color="secondary" :label="($t('CHECK'))" @click="callShowModal(props.row.tid)">
            <!-- {{operationBtn(props.value)}} -->
          </q-btn>
        </q-td>
        <q-td slot="body-cell-period" slot-scope="props" :props="props">
          <!-- <q-btn flat :label="$t('proposal.OPERATION')" color="primary"> -->
          <!-- {{props.value | jparse('updateInterval', true) || 'N/A'}} -->
          {{stt(props.row)}}
          <!-- </q-btn> -->
        </q-td>
      </q-table>
    </div>
  
  </q-page>
</template>

<script>
/* eslint-disable */
import { QPage, QBtnGroup, QTable, QTd, QBtn, QPopover } from 'quasar'
import { mapActions } from 'vuex'
import { getTimeFromTrade, compileTimeStamp } from '../utils/util'

export default {
  name: 'Proposal',
  components: {
    QPage,
    QBtnGroup,
    QTable,
    QTd,
    QBtn,
    QPopover
  },
  data() {
    return {
      filter: '',
      loading: false,
      // get infos filter
      activatedState: 'all',
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      proposalDetail: [],
      columns: [
        {
          name: 'tid',
          required: true,
          label: this.$t('proposal.No'),
          align: 'center',
          field: 'tid'
        },
        // {
        //   name: 'initiator',
        //   required: true,
        //   label: this.$t('proposal.INITIATOR'),
        //   align: 'center',
        //   field: 'initiator'
        // },
        {
          name: 'topic',
          required: true,
          label: this.$t('proposal.TYPE'),
          align: 'center',
          field: 'topic'
        },
        {
          name: 'period',
          required: true,
          label: this.$t('proposal.PERIOD'),
          align: 'center',
          field: 'content'
        },
        {
          name: 'desc',
          required: true,
          label: this.$t('proposal.DETAIL'),
          align: 'center',
          field: 'desc'
        },
        // {
        //   name: 'approve',
        //   required: true,
        //   label: this.$t('proposal.APPROVE'),
        //   align: 'center',
        //   field: 'approve'
        // },
        {
          name: 'activated',
          required: true,
          label: this.$t('proposal.STATUS'),
          align: 'center',
          field: 'activated'
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
        offset: (pageNo - 1) * limit,
        type: this.activatedState
      }
      let res = await this.getProposals(condition)
      this.proposalDetail = res.proposals
      this.pagination.rowsNumber = res.count
      this.loading = false
      return res
    },
    async request(props) {
      await this.getProposalsFunc(props.pagination, props.filter)
    },
    operationBtn(val) {
      switch (val) {
        case 0:
          return this.$t('proposal.TIP_VOTE')
        case 1:
          return this.$t('proposal.TIP_PASS')
        case 2:
          return this.$t('proposal.TIP_REJECT')
      }
    },
    transGate(val) {
      switch (val) {
        case 'gateway_register':
          return this.$t('proposal.SELECT_NEWNET')
        case 'gateway_init':
          return this.$t('proposal.SELECT_INITNET')
        case 'gateway_update_member':
          return this.$t('proposal.SELECT_MEMBER_ACTION')
      }
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
    callShowModal(tid) {
      this.$router.push({
        name: 'proposalDetail',
        params: {
          tid: tid
        }
      })
      // this.isDetailShow = true
    },
    stt(obj) {
      let start = compileTimeStamp(obj.t_timestamp)
      let end = getTimeFromTrade({
        tTimestamp: obj.t_timestamp,
        tHeight: obj.t_height,
        endHeight: obj.endHeight
      })
      return `${start} - ${end}`
    }
  },
  computed: {
    proposalBtnClass() {
      return this.isDesk ? 'font-22 proposal-content-top-btn' : 'font-12 proposal-content-top-btn'
    }
  },
  mounted() {
    this.getProposalsFunc()
  }
}
</script>

<style lang="stylus" scoped>
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
</style>
