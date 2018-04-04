<template>
  <q-page class="layout-padding">
    <q-btn-group outline>
      <q-btn flat color="primary" :label="$t('proposal.TITLE_ALL')" />
      <q-btn flat color="primary" :label="$t('proposal.TITLE_PROCESS')" />
      <q-btn flat color="primary" :label="$t('proposal.TITLE_DONE')" />
    </q-btn-group>
    <q-btn-group class="float-right">
      <q-btn size="sm" color="primary" :label="$t('proposal.LAUNCH')"></q-btn>
    </q-btn-group>
      <!-- <q-tab default slot="title" :label="$t('proposal.TITLE_ALL')" />
      <q-tab slot="title" :label="$t('proposal.TITLE_PROCESS')" />
      <q-tab slot="title" :label="$t('proposal.TITLE_DONE')" />
      <q-btn size="sm" flat slot="top-right" class="float-right">Launch</q-btn> -->
      <!-- tab pane content -->
      <q-table :data="proposalDetail" :columns="columns" row-key="no" :pagination.sync="pagination">
        <q-td slot="body-cell-detail" slot-scope="props" :props="props">
          {{props.value.substring(0,20) + '...'}}
          <q-popover v-if="props.value" ref="popover-msg">
            <div class="light-paragraph">{{props.value}}</div>
          </q-popover>
        </q-td>
        <q-td slot="body-cell-operation" slot-scope="props" :props="props">
          <q-btn flat color="primary" @click="callModal">
            {{operationBtn(props.value)}}
          </q-btn>
        </q-td>
      </q-table>

    <!-- modal area -->
    <launch-modal :show="isLaunchShow"></launch-modal>
  </q-page>
</template>

<script>
import {
  QPage,
  QBtnGroup,
  QTable,
  QTd,
  QBtn,
  QPopover,
  QTooltip
} from 'quasar'
import launchModal from '../components/LaunchProposalModal'

export default {
  name: 'Proposal',
  components: {
    QPage,
    QBtnGroup,
    QTable,
    QTd,
    QBtn,
    QPopover,
    QTooltip,
    launchModal
  },
  data() {
    return {
      filter: '',
      loading: false,
      pagination: {
        page: 1,
        rowsNumber: 0,
        rowsPerPage: 10
      },
      proposalDetail: [
        {
          'no': 1,
          'initiator': 'A-Z',
          'type': 'sell',
          'period': '2016/03/01-2019/09/09',
          'approve': '99',
          'detail': 'here should be the detail, and you all should mind that',
          'operation': 0
        }
      ],
      columns: [
        {
          name: 'no',
          required: true,
          label: this.$t('proposal.No'),
          align: 'center',
          field: 'no'
        },
        {
          name: 'initiator',
          required: true,
          label: this.$t('proposal.INITIATOR'),
          align: 'center',
          field: 'initiator'
        },
        {
          name: 'type',
          required: true,
          label: this.$t('proposal.TYPE'),
          align: 'center',
          field: 'type'
        },
        {
          name: 'period',
          required: true,
          label: this.$t('proposal.PERIOD'),
          align: 'center',
          field: 'period'
        },
        {
          name: 'detail',
          required: true,
          label: this.$t('proposal.DETAIL'),
          align: 'center',
          field: 'detail'
        },
        {
          name: 'approve',
          required: true,
          label: this.$t('proposal.APPROVE'),
          align: 'center',
          field: 'approve'
        },
        {
          name: 'operation',
          required: true,
          label: this.$t('proposal.OPERATION'),
          align: 'center',
          field: 'operation'
        }
      ],
      // modal set
      isLaunchShow: false,
      btnStatus: 1
    }
  },
  methods: {
    async getProposals(pagination = {}, filter = '') {
      this.loading = true
      if (pagination.page) this.pagination = pagination
      // let limit = this.pagination.rowsPerPage
      // let pageNo = this.pagination.page
      // let condition = {
      // params
      // recipientId: this.userInfo.account.address,
      // senderPublicKey: this.userInfo.account.publicKey,
      // orderBy: 't_timestamp:desc',
      // limit: limit,
      // offset: (pageNo - 1) * limit
      // }
      // let res = await this.getProposal(condition)
      // this.proposalDetail = res.proposalDetail
      // this.loading = false
      // return res
    },
    async request(props) {
      await this.getProposals(props.pagination, props.filter)
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
    callModal() {
      this.isLaunchShow = true
    }
  },
  computed: {
  }
}
</script>

<style lang="stylus" scoped>

</style>
