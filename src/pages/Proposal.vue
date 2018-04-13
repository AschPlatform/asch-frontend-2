<template>
  <q-page class="layout-padding">
    <q-btn-group outline>
      <q-btn flat color="primary" :label="$t('proposal.TITLE_ALL')" />
      <q-btn flat color="primary" :label="$t('proposal.TITLE_PROCESS')" />
      <q-btn flat color="primary" :label="$t('proposal.TITLE_DONE')" />
    </q-btn-group>
    <q-btn-group class="float-right">
      <q-btn size="sm" color="primary" :label="$t('proposal.LAUNCH')" @click="callModal"></q-btn>
    </q-btn-group>
      <!-- <q-tab default slot="title" :label="$t('proposal.TITLE_ALL')" />
      <q-tab slot="title" :label="$t('proposal.TITLE_PROCESS')" />
      <q-tab slot="title" :label="$t('proposal.TITLE_DONE')" />
      <q-btn size="sm" flat slot="top-right" clas+s="float-right">Launch</q-btn> -->
      <!-- tab pane content -->
      <q-table :data="proposalDetail"
      :columns="columns"
      row-key="no"
      :pagination.sync="pagination"
      @request="request"
      >
        <q-td slot="body-cell-desc" slot-scope="props" :props="props">
          {{props.value.substring(0,20) + '...'}}
          <q-popover v-if="props.value" ref="popover-msg">
            <div class="light-paragraph">{{props.value}}</div>
          </q-popover>
        </q-td>
        <q-td slot="body-cell-tid" slot-scope="props" :props="props">
          {{props.value.substring(0, 7)}}
          <q-popover v-if="props.value" ref="popover-msg">
            <div class="light-paragraph">{{props.value}}</div>
          </q-popover>
        </q-td>
        <q-td slot="body-cell-operation" slot-scope="props" :props="props">
          <q-btn flat :label="$t('proposal.OPERATION')" color="primary" @click="callShowModal">
            {{operationBtn(props.value)}}
          </q-btn>
        </q-td>
        <q-td slot="body-cell-period" slot-scope="props" :props="props">
          <!-- <q-btn flat :label="$t('proposal.OPERATION')" color="primary"> -->
            {{props.value | jparse('updateInterval', true)}}
          <!-- </q-btn> -->
        </q-td>
      </q-table>

    <!-- modal area -->
    <launch-modal :show="isLaunchShow" @hide="callOffModal"></launch-modal>
    <show-modal :show="isDetailShow" @hide="callOffModal"></show-modal>
  </q-page>
</template>

<script>
/* eslint-disable */
import {
  QPage,
  QBtnGroup,
  QTable,
  QTd,
  QBtn,
  QPopover,
  QTooltip
} from 'quasar'
import { mapActions } from 'vuex'
import launchModal from '../components/LaunchProposalModal'
import showModal from '../components/ShowProposalModal'

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
    launchModal,
    showModal
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
        // {
        //   'no': 1,
        //   'initiator': 'A-Z',
        //   'type': 'sell',
        //   'period': '2016/03/01-2019/09/09',
        //   'approve': '99',
        //   'detail': 'here should be the detail, and you all should mind that',
        //   'operation': 0
        // }
      ],
      columns: [
        {
          name: 'tid',
          required: true,
          label: this.$t('proposal.No'),
          align: 'center',
          field: 'tid'
        },
        {
          name: 'initiator',
          required: true,
          label: this.$t('proposal.INITIATOR'),
          align: 'center',
          field: 'initiator'
        },
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
          name: 'operation',
          required: true,
          label: this.$t('proposal.OPERATION'),
          align: 'center',
          field: 'operation'
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
      let res = await this.getProposals(condition)
      this.proposalDetail = res.proposals
      this.loading = false
      console.log('got it', res)
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
    callModal() {
      this.isLaunchShow = true
    },
    callShowModal() {
      this.isDetailShow = true
    },
    callOffModal() {
      this.isLaunchShow = false
      this.isDetailShow = false
    }
  },
  computed: {
  },
  mounted() {
    this.getProposalsFunc()
  }
}
</script>

<style lang="stylus" scoped>

</style>
