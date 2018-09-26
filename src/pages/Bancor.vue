<template>
  
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
        {
          name: 'topic',
          required: true,
          label: this.$t('proposal.TYPE'),
          align: 'center',
          field: 'topic'
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
      let start = compileTimeStamp(obj.timestamp)
      let end = getTimeFromTrade({
        tTimestamp: obj.timestamp,
        tHeight: obj.height,
        endHeight: obj.endHeight
      })
      return `${start} - ${end}`
    }
  },
  computed: {
    proposalBtnClass() {
      return this.isDesk ? 'font-18 proposal-content-top-btn' : 'font-12 proposal-content-top-btn'
    }
  },
  mounted() {
    this.getProposalsFunc()
  }
}
</script>

<style lang="stylus" scoped>
.proposal-container
  padding 20px
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
.light-paragraph{
    word-break: break-all;
    max-width: 400px;
}
</style>
