<template>
  <q-page>
    <q-card :class="proposalDetailClass" color="white" text-color="black">
      <q-card-title class="col-12 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('proposal.SHOW')}}
        <q-btn color="secondary" slot="right" class="row items-center" @click="back">
          <q-icon name="reply" /> {{$t('CANCEL')}}
        </q-btn>
      </q-card-title>
      <q-card-separator class="col-12 q-my-lg bg-999 no-border-top" />
      <div class="row col-12">
        <q-field :label-width="2" :label="$t('proposal.SELECT_P_TITLE')" class="col-10 font-16">
          <q-input class="border-1" readonly hide-underline v-model="detail.title" value="" />
        </q-field>
      </div>
      <div class="row col-12">
        <q-field :label-width="2" :label="$t('proposal.SELECT_P_TYPE')" class="col-10 font-16">
          <q-input class="border-1" readonly hide-underline v-model="dealWithType" value="" />
          <!-- <span>{{detail.content | jparse('name', false)}}</span> -->
        </q-field>
      </div>
      <div class="row col-12">
        <q-field :label-width="2" class="row col-10 font-16" :label="$t('proposal.SELECT_P_PERIOD')">
          <q-input class="border-1 col-5 inline-flex" readonly hide-underline value="" v-model="time_buffer"></q-input>
          {{$t('TO')}}
          <q-input class="border-1 col-5 inline-flex" readonly hide-underline value="" v-model="time_end"></q-input>
        </q-field>
  
        <!-- <q-field class="col-md-2 col-xs-5 font-16">
        </q-field> -->
        <!-- <q-field class="col-md-1 col-xs-2 font-16" :label="$t('TO')">
        </q-field> -->
        <!-- <q-field class="col-md-2 col-xs-5 font-16">
        </q-field> -->
  
      </div>
    </q-card>
  
    <q-card :class="proposalDetailClass" color="white" text-color="black">
      <!-- below is content of the proposal -->
      <q-card-title class="col-12 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('proposal.CONTENT')}}
      </q-card-title>
      <q-card-separator class="col-12 q-my-lg bg-999 no-border-top" />
      <q-card-main class="col-12 padding-0">
  
        <!-- below is net new page -->
        <div class="col-12" v-if="this.detail.topic === 'gateway_register'" id="new">
          <div class="row col-12">
            <q-field class="block col-10 font-16" label-width="2" :label="$t('LAUNCH_MODAL.NET_NAME')">
              <q-input class="border-1" readonly hide-underline v-model="content.name" value="" />
            </q-field>
          </div>
          <div class="row col-12">
            <q-field class="block col-10 font-16" label-width="2" :error-label="$t('LAUNCH_MODAL.NET_CURRENCY_TIP')" :label="$t('LAUNCH_MODAL.NET_CURRENCY')">
              <q-input class="border-1" readonly hide-underline v-model="content.currency.symbol" value=""></q-input>
            </q-field>
          </div>
          <div class="row col-12">
            <q-field class="block col-10 font-16" label-width="2" :error-label="$t('LAUNCH_MODAL.PRECISION_TIP')" :label="$t('PRECISION')">
              <q-input class="border-1" readonly hide-underline v-model="content.currency.precision" value=""></q-input>
            </q-field>
          </div>
          <div class="row col-12">
            <q-field class="block col-10 font-16" label-width="2" :error-label="$t('LAUNCH_MODAL.CURRENCY_BRIEF_TIP')" :label="$t('LAUNCH_MODAL.CURRENCY_BRIEF')">
              <q-input class="border-1 textareaInner" type="textarea" readonly hide-underline v-model="content.currency.desc" value=""></q-input>
            </q-field>
          </div>
          <div class="row col-12">
            <q-field class="block col-10 font-16" label-width="2" :error-label="$t('ERR.ERR_3_15')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
              <q-input class="border-1" readonly hide-underline v-model="content.minimumMembers" value=""></q-input>
            </q-field>
          </div>
          <div class="row col-12">
            <q-field class="col-10 font-16" label-width="2" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD_NET')">
              <q-input class="border-1" readonly hide-underline v-model="content.interval" value="" color="black"></q-input>
            </q-field>
          </div>
          <div class="row col-12">
            <q-field class="col-10 font-16" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
              <q-input class="border-1 textareaInner" type="textarea" value="" readonly hide-underline v-model="detail.desc"></q-input>
            </q-field>
          </div>
        </div>
  
        <!-- below is net init page -->
        <div class="col-12" v-if="this.detail.topic === 'gateway_init'" id="init">
          <div class="row col-12">
            <q-field class="col-10 font-16" label-width="2" :label="$t('LAUNCH_MODAL.NET_NAME')">
              <q-input class="border-1" readonly hide-underline value="" v-model="content.gateway"></q-input>
            </q-field>
          </div>
          <div class="row">
            <q-field class="col-10 font-16" label-width="2">
              <!-- <q-input class="border-1" readonly hide-underline value="" v-model="memberString" type="textarea" disabled>{{$t('LAUNCH_MODAL.PROPOSE_END')}}</q-input> -->
              <p class="break">
                {{$t('LAUNCH_MODAL.MEMBER_SUGGEST', {member: memberString, number: content.members.length})}}
              </p>
            </q-field>
          </div>
        </div>
  
        <!-- below is member memberIndicator -->
        <member-indicator v-if="isIndicatorShow" :memberPost="postMemberList" :memberPre="preMemberList" :showCounter="showCounter" :type="this.detail.topic"></member-indicator>
      </q-card-main>
    </q-card>
  
    <q-card :class="proposalDetailClass" color="white" text-color="black">
      <q-card-title class="col-12 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('proposal.VOTE_DETAIL')}}
      </q-card-title>
      <q-card-separator class="col-12 q-my-lg bg-999 no-border-top" />
      <!-- below is vote status -->
      <q-card-main class="col-12 padding-0">
        <p class="font-16">{{$t('proposal.VOTE_STATUS', {number: voteTotalNum, rate: votePassRate})}}</p>
        <!-- <p class="font-16">{{$t('LAUNCH_MODAL.VOTE_LIST')}}</p> -->
        <q-field label-width="2" :label="$t('LAUNCH_MODAL.VOTE_LIST')" class="vote-list">
          <!-- <q-chips-input square chips-color="secondary" color="secondary" class="col-md-5 col-xs-12" inverted readonly v-model="voteList" disable>
          </q-chips-input> -->
          <q-chip square v-for="(item, idx) in voteList" color="white" text-color="secondary" :key="idx" class="chip">{{item}}</q-chip>
        </q-field>
      </q-card-main>
  
      <q-card-separator class="col-12 q-my-lg bg-999 no-border-top" />
      <!-- below is func btn -->
      <div class="row col-12" v-show="!isBtnAble">
        <q-field v-if="secondSignature" class="col-8 font-16" :label="$t('TRS_TYPE_SECOND_PASSWORD')+':'" :label-width="2">
          <q-input v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
        </q-field>
      </div>
      <q-card-main v-show="isDelegate" class="row justify-center">
        <q-btn color="secondary" class="col-4" :label="$t(btnInfo)" @click="active" :disabled="isBtnAble"></q-btn>
      </q-card-main>
    </q-card>
  
  </q-page>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import {
  deCompileContent,
  compileTimeStamp,
  toast,
  toastError,
  getTimeFromTrade
} from '../utils/util'
import { secondPwd } from '../utils/validators'
import MemberIndicator from '../components/MemberIndicator'
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
  QChipsInput,
  QChip,
  QIcon,
  QBtn
} from 'quasar'

export default {
  name: 'ProposalDetail',
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
    QChip,
    MemberIndicator,
    QIcon,
    QBtn
  },
  props: ['user'],
  data() {
    return {
      tid: '',
      secondPwd: '',
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
      time_buffer: 0,
      time_end: 0,
      voteList: [],
      voteTotalNum: 0,
      votePassRate: 0,
      // func btn
      isBtnAble: true,
      btnInfo: '',
      activeState: 0
    }
  },
  validations: {
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  methods: {
    ...mapActions([
      'getProposal',
      'getGatewayDelegates',
      'getProposalVotes',
      'voteProposal',
      'activeProposal'
    ]),
    back() {
      this.$router.back()
    },
    async getProposalInfo() {
      let res = await this.getProposal({
        tid: this.$route.params.tid
      })
      this.detail = res.proposal
      this.time_buffer = compileTimeStamp(this.detail.timestamp)
      this.envalueEnd()
      this.content = deCompileContent(this.detail.content)
      this.content.interval = Math.round(this.content.updateInterval / 8640) + this.$t('LAUNCH_MODAL.DAY')
      if (this.detail.activated === 1) {
        this.btnInfo = 'proposal.ACTIVATED'
        this.isBtnAble = true
      } else if (this.detail.endHeight < this.latestBlock.height) {
        this.btnInfo = 'proposal.EXPIRED'
        this.isBtnAble = true
      } else {
        this.btnInfo = 'proposal.BTN_VOTE'
        this.isBtnAble = false
      }
    },
    async getVoterInfo() {
      let res = await this.getProposalVotes({
        tid: this.$route.params.tid
      })
      let ls = []
      if (res.success) {
        res.votes.forEach(o => {
          return ls.push(o.account.name)
        })
      }
      this.voteList = ls
      this.voteTotalNum = res.totalCount
      this.votePassRate = ((Number(res.validCount / 101) || 0) * 100).toFixed(0)
    },
    async getValidatorInfo(name) {
      let res = await this.getGatewayDelegates(name)
      if (res.success) {
        let ls = []
        res.validators.forEach(o => {
          if (o.elected === 1) {
            return ls.push(o.address)
          }
        })
        // directly envalue both the list
        this.preMemberList = ls
        this.postMemberList = ls
      }
      // if (this.detail.activated === 1) {
      //   this.btnInfo = 'proposal.ACTIVATED'
      //   this.isBtnAble = false
      // } else if (this.detail.endHeight < this.latestBlock.height) {
      //   this.btnInfo = 'proposal.EXPIRED'
      //   this.isBtnAble = false
      // } else {
      //   this.btnInfo = 'proposal.ACTIVE'
      //   this.isBtnAble = true
      // }
    },
    async activePro() {
      let res = await this.activeProposal({
        tid: this.$route.params.tid,
        secondPwd: this.secondPwd
      })
      if (res.success) {
        toast(this.$t('ACTIVE_SUCCESS'))
      } else {
        toastError(res.error)
      }
    },
    async votePro() {
      let res = await this.voteProposal({
        tid: this.$route.params.tid,
        secondPwd: this.secondPwd
      })
      if (res.success) {
        toast(this.$t('VOTE_SUCCESS'))
      } else {
        toastError(res.error)
      }
    },
    active() {
      // to check if you are already vote
      // i
      if (this.activeState === 0) {
        this.votePro()
      } else {
        this.activePro()
      }
    },
    envalueEnd() {
      this.time_end = getTimeFromTrade({
        tTimestamp: this.detail.timestamp,
        tHeight: this.detail.height,
        endHeight: this.detail.endHeight
      })
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState(['latestBlock']),
    proposalDetailClass() {
      return this.isDesk ? 'padding-20 card-margin q-my-xl padding-top-0' : 'row padding-20 margin-top-20 padding-top-0'
    },
    // enpower
    dealWithType() {
      switch (this.detail.topic) {
        case 'gateway_register':
          this.isIndicatorShow = false
          return this.$t('proposal.SELECT_NEWNET')
        case 'gateway_init':
          this.isIndicatorShow = true
          this.postMemberList = this.content.members
          this.memberString = this.content.members.join(' , ')
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
    secondSignature() {
      return this.userInfo ? this.userInfo.account.secondPublicKey : null
    },
    isDelegate() {
      return this.userInfo && this.userInfo.account ? this.userInfo.account.isDelegate === 1 : false
    }
  },
  mounted() {
    this.getProposalInfo()
    this.getVoterInfo()
  },
  watch: {
    userInfo() {
      this.getProposalInfo()
      this.getVoterInfo()
    },
    detail(val) {
      if (!this._.isEmpty(this.detail) && this.voteTotalNum !== 0) {
        if (this.detail.activated === 1) {
          this.btnInfo = 'proposal.ACTIVATED'
          this.isBtnAble = true
        } else if (this.detail.endHeight < this.latestBlock.height) {
          this.btnInfo = 'proposal.EXPIRED'
          this.isBtnAble = true
        } else if (this.voteTotalNum <= 67) {
          this.btnInfo = 'proposal.BTN_VOTE'
          this.isBtnAble = false
          this.activeState = 0
        } else {
          this.btnInfo = 'proposal.ACTIVE'
          this.isBtnAble = false
          this.activeState = 1
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.no-border-top {
  margin-top: 0 !important;
}

.border-1
  border 1px solid #999
  padding-left 10px
  min-height 50px

.textareaInner
  padding-top 15px

.inline-flex
  display inline-flex

.padding-top-0
  padding-top: 0px;

.card-margin
  margin 36px

.chip
  margin 0 5px 5px 0
  border 1px solid #5CB8B3

.break
  font-weight 600
  word-break break-all
</style>