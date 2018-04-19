<template>
  <q-page>
    <q-card class="layout-padding q-mx-xl q-my-xl">
      <q-card-title>{{$t('proposal.SHOW')}}
          <q-btn color="warning" slot="right" class="row items-center" @click="back">
            <q-icon name="place" /> {{$t('CANCEL')}}
          </q-btn>
        </q-card-title>
        <div class="row">
          <q-field :label-width="2" :label="$t('proposal.SELECT_P_TITLE')" class="col-8">
            <q-input readonly hide-underline v-model="detail.title" value=""/>
          </q-field>
        </div>
        <div class="row">
          <q-field :label-width="3" :label="$t('proposal.SELECT_P_TYPE')" class="col-4">
            <q-input readonly hide-underline v-model="dealWithType" value=""/>
            <span>{{detail.content | jparse('name', false)}}</span>
          </q-field>
        </div>
        <div class="row">
          <q-field :label-width="4" class="col-3" :label="$t('proposal.SELECT_P_PERIOD')">
            <q-input readonly hide-underline value="" v-model="time_buffer"></q-input>
          </q-field>
          <span class="self-center col-1" align="center">至</span>
          <q-field class="col-3 q-ml-xl">
            <q-input readonly hide-underline value="" v-model="time_end"></q-input>
          </q-field>
        </div>
      <q-card-separator class="q-my-lg"/>
      <!-- below is content of the proposal -->
      <q-card-main>
        <q-field>

          <!-- below is net new page -->
          <div class="col-12" v-if="this.detail.topic === 'gateway_register'" id="new">
            <div class="row">
              <q-field class="block col-5" label-width="3" :label="$t('LAUNCH_MODAL.NET_NAME')">
                <q-input readonly hide-underline v-model="content.name" value=""/>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.NET_CURRENCY_TIP')" :label="$t('LAUNCH_MODAL.NET_CURRENCY')">
                <q-input readonly hide-underline v-model="content.currency.symbol" value=""></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.PRECISION_TIP')" :label="$t('PRECISION')">
                <q-input readonly hide-underline v-model="content.currency.precision" value=""></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.CURRENCY_BRIEF_TIP')" :label="$t('LAUNCH_MODAL.CURRENCY_BRIEF')">
                <q-input type="textarea" readonly hide-underline v-model="content.currency.desc" value=""></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-2" label-width="8" :error-label="$t('ERR.ERR_3_15')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input readonly hide-underline v-model="content.minimumMembers" value=""></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-2" label-width="8" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD_NET')">
                <q-input readonly hide-underline v-model="content.updateInterval" value=""></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-8" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input type="textarea" value="" readonly hide-underline v-model="content.desc"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is net init page -->
          <div class="col-12" v-if="this.detail.topic === 'gateway_init'" id="init">
            <div class="row">
              <q-field class="col-8" label-width="2" :label="$t('LAUNCH_MODAL.NET_NAME')">
                <q-input readonly hide-underline value="" v-model="content.gateway"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9" label-width="2" :label="$t('LAUNCH_MODAL.PROPOSE')">
                <q-input readonly hide-underline value="" v-model="memberString" type="textarea" :suffix="$t('LAUNCH_MODAL.PROPOSE_END')" disabled></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is member memberIndicator -->
          <member-indicator v-if="isIndicatorShow" :memberPost="postMemberList" :memberPre="preMemberList" :showCounter="showCounter" :type="this.detail.topic"></member-indicator>
        </q-field>
      </q-card-main>

      <q-card-separator class="q-my-lg"/>
      <!-- below is vote status -->

    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { deCompileContent, compileTimeStamp } from '../utils/util'
import memberIndicator from '../components/MemberIndicator'
import {
  QPage,
  QField,
  QModal,
  QInput,
  QCard,
  QCardMain,
  QCardTitle,
  QCardSeparator,
  QCheckbox,
  QChipsInput
} from 'quasar'

export default {
  name: 'ProposalDetail',
  props: ['show', 'type'],
  data() {
    return {
      tid: '',
      detail: {},
      content: {
        currency: {}
      },
      gatewayName: '',
      memberString: '',
      memberNumber: 0,
      postMemberList: [],
      preMemberList: [],
      isIndicatorShow: false,
      showCounter: false,
      time_buffer: 0
    }
  },
  components: {
    QPage,
    QField,
    QModal,
    QInput,
    QCard,
    QCardMain,
    QCardTitle,
    QCardSeparator,
    QCheckbox,
    QChipsInput,
    memberIndicator
  },
  methods: {
    ...mapActions(['getProposal', 'getGatewayDelegates']),
    back() {
      this.$router.back()
    },
    async getProposalInfo() {
      let res = await this.getProposal({
        tid: this.$route.params.tid
      })
      this.detail = res.proposal
      this.time_buffer = compileTimeStamp(this.detail.t_timestamp)
      this.content = deCompileContent(this.detail.content)
    },
    async getValidatorInfo(name) {
      debugger
      let res = await this.getGatewayDelegates(name)
      if (res.success) {
        let ls = []
        this._.each(res.validators, function (o) {
          if (o.elected === 1) {
            return ls.push(o.address)
          }
        })
        // directly envalue both the list
        this.preMemberList = ls
        this.postMemberList = ls
      }
    }
  },
  computed: {
    // enpower
    dealWithType() {
      switch (this.detail.topic) {
        case 'gateway_register':
          this.isIndicatorShow = false
          return this.$t('proposal.SELECT_NEWNET')
        case 'gateway_init':
          this.isIndicatorShow = true
          this.postMemberList = this.content.members
          this.memberString = this.content.members.join(' / ')
          this.gatewayName = this.content.gateway
          return this.$t('proposal.SELECT_INITNET')
        case 'gateway_update_member':
          this.isIndicatorShow = true
          this.preMemberList = this.content.from
          this.postMemberList = this.content.to
          return this.$t('proposal.SELECT_MEMBER_ACTION')
      }
    },
    // compile time start / end
    time_end() {
      let d = new Date(this.time_buffer)
      let start = d.getTime()
      let end = (this.detail.endHeight - this.detail.t_height) * 1000
      let total = new Date(start + end)
      let month = total.getMonth() + 1;
      let day = total.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      let h = d.getHours();
      let m = d.getMinutes();
      let s = d.getSeconds();
      if (h < 10) {
        h = "0" + h;
      }

      if (m < 10) {
        m = "0" + m;
      }

      if (s < 10) {
        s = "0" + s;
      }
      return d.getFullYear() + "/" + month + "/" + day + " " + h + ":" + m + ":" + s
    }
  },
  mounted() {
    this.getProposalInfo()
  }
}
</script>

<style lang="stylus" scoped>

</style>