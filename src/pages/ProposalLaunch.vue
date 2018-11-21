<template>
  <q-page>
    <q-card :class="proposalLaunchClass" color="white" text-color="black">
      <q-card-title class="col-12 font-22 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('proposal.LAUNCH')}}
        <q-btn color="secondary" slot="right" class="row items-center" @click="hideModal">
          <q-icon name="reply" />
        </q-btn>
      </q-card-title>
      <q-card-separator class="col-12 q-my-lg bg-999 no-border-top" />
      <div class="row col-md-12">
        <q-field :error-label="$t('ERR.ERR_10_100_TITLE')" :label-width="2" :label="$t('proposal.SELECT_P_TITLE')" class="col-md-8 col-xs-12 font-16 text-four">
          <q-input v-model="p_title" @focus="$v.p_title.$reset()" @blur="$v.p_title.$touch()" :error="$v.p_title.$error" />
        </q-field>
      </div>
      <div class="row col-md-12">
        <q-field :label-width="2" :error-label="$t('ERR.ERR_REQUIRE_TYPE')" :label="$t('proposal.SELECT_P_TYPE')" class="col-md-8 col-xs-12 font-16 text-four">
          <q-select color="white" v-model="first_type" :options="proposalType" @blur="$v.first_type.$touch()" :error="$v.first_type.$error" />
        </q-field>
        <q-field :label-width="2" :label="$t('proposal.SELECT_P_COUNCIL')" class="col-md-8 col-xs-12 font-16 text-four" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type === 'change' || this.first_type === 'period' ">
          <q-select v-model="p_selected" :options="councilList" @blur="$v.p_selected.$touch()" :error="$v.p_selected.$error" :placeholder="$t('proposal.SELECT_P_COUNCIL')" />
        </q-field>
        <q-field class="col-md-8 col-xs-12 font-16 text-four" :label="$t('proposal.SELECT_P_NET')" :label-width="2" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type === 'init' || this.first_type === 'member_n' || this.first_type === 'gateway_freeze' || this.first_type === 'gateway_clear' && this.first_type !== 'new' && this.first_type !== null">
          <q-select v-model="p_selected" :options="netList" @change="val => {console.log(val)}" @blur="$v.p_selected.$touch()" :error="$v.p_selected.isSelected" :placeholder="$t('proposal.SELECT_P_NET')" />
        </q-field>
      </div>
      <div class="row col-md-12">
        <q-field :helper="$t('AT_LEAST_7DAY')" :label-width="2" class="col-md-8 col-xs-12 font-16 text-four" :label="$t('proposal.SELECT_P_PERIOD')">
          <q-datetime :min="tomorrow" v-model="p_time_end" @blur="$v.p_time_end.$touch()" :error="$v.p_time_end.$error" />
        </q-field>
      </div>
    </q-card>
  
    <q-card :class="proposalLaunchClass" v-show="this.first_type !== null" color="white" text-color="black">
      <q-card-title class="col-12 font-22 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('proposal.CONTENT')}}
      </q-card-title>
      <q-card-separator class="col-12 q-my-lg bg-999 no-border-top" />
      <transition-group class="col-12" appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
  
        <q-card-main key="content" class="row col-12">
          <!-- below is new page -->
          <div v-show="this.first_type === 'new'" id="new" class="col-md-8 col-xs-12">
            <div class="row col-12">
              <q-field class="block col-md-6 col-xs-12" label-width="4" :error-label="$t('ERR.ERR_REQUIRE_NUMBER')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input min=7 max=33 type="number" v-model="NEW.memberNumber" @blur="$v.NEW.memberNumber.$touch()" :error="$v.NEW.memberNumber.$error" :suffix="$t('LAUNCH_MODAL.PERSON')"></q-input>
              </q-field>
            </div>
            <div class="row col-12">
              <q-field class="col-md-6 col-xs-12" label-width="4" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="NEW.selected" @blur="$v.NEW.selected.$touch()" :error="$v.NEW.selected.ifEnough" :options="NEW.memberList"></q-select>
              </q-field>
            </div>
            <div class="row col-12">
              <q-field class="col-md-6 col-xs-12" label-width="4" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD')">
                <q-input type="number" v-model="NEW.period" @blur="$v.NEW.period.$touch()" :error="$v.NEW.period.$error" :suffix="$t('LAUNCH_MODAL.DAY')"></q-input>
              </q-field>
            </div>
            <div class="">
              <q-field class="col-8" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
              </q-field>
            </div>
          </div>
  
          <!-- below is net new page -->
          <new-gateway v-if="this.first_type === 'new_n'" @send="envaluePackage"></new-gateway>
  
          <!-- below is net init page -->
          <init-gateway v-if="this.first_type === 'init' && this.initFalse" :name="p_selected.name" :delegateList="delegateList" @send="envaluePackage">
            <div slot="fin" class="col-12" v-show="!this.initFalse">
              <div class="row">{{$t('ALREADY_INIT')}}</div>
            </div>
          </init-gateway>

          <!-- below is net freeze page -->
          <!-- TODO: -->
          <freeze-gateway v-if="this.first_type === 'gateway_freeze' && this.initFalse" :name="p_selected.name" @send="envaluePackage"></freeze-gateway>

          <!-- below is net clear page -->
          <!-- TODO: -->
          <claim-gateway v-if="this.first_type === 'gateway_clear' && this.initFalse" :electedList="MEMBER.electedList" :name="p_selected.name" @send="envaluePackage"></claim-gateway>

          <!-- below is net init disabled page -->
          <div class="col-12" v-show="this.first_type === 'init' && !this.initFalse">
            <div class="row">{{$t('ALREADY_INIT')}}</div>
          </div>
  
          <!-- below is net period page -->
          <div class="col-12" v-show="this.first_type === 'period_n'" id="remove">
            <div class="row">
              <q-field :label-width="4" :label="$t('LAUNCH_MODAL.NET_PERIOD')" class="col-3 font-16 text-four">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" disabled readonly v-model="PERIOD.pre" />
              </q-field>
              <span class="self-center q-ml-lg">{{$t('LAUNCH_MODAL.INSTEAD_POST')}}</span>
              <q-field class="col-3 q-ml-xl font-16 text-four" :error-label="$t('ERR.ERR_1_30')">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" v-model="PERIOD.post" />
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.PERIOD_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
              </q-field>
            </div>
          </div>
  
          <!-- below is net member page -->
          <member-change v-if="this.first_type === 'member_n'" :name="p_selected.name" :unelectedList="MEMBER.unelectedList" :electedList="MEMBER.electedList" @send="envaluePackage"></member-change>
  
          <!-- below is remove page -->
          <div class="col-12" v-show="this.first_type === 'remove'" id="remove">
            <div class="">
              <q-field class="font-16 text-four" label-width="1" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.REMOVE_OBJECT')">
                <q-select align="center" color="secondary" chips filter v-model="p_selected" :options="councilList"></q-select>
              </q-field>
              <q-field class="font-16 text-four" label-width="1" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.REMOVE_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
              </q-field>
            </div>
          </div>
  
          <!-- below is period page -->
          <div class="col-12" v-show="this.first_type === 'period'" id="remove">
            <div class="row">
              <q-field class="col-9 font-16 text-four" label-width="8" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD_SHIFT', {pre: PERIOD.pre})">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" v-model="PERIOD.post" />
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.PERIOD_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')" :max-height="100" :maxlength="1000" />
              </q-field>
            </div>
          </div>
  
          <!-- below is member page -->
          <div class="col-12" v-show="this.first_type === 'change'" id="remove">
            <div class="row">
              <q-field :label-width="4" :error-label="$t('ERR.ERR_REQUIRE_TYPE')" :label="$t('proposal.SELECT_MEMBER_ACTION')" class="col-3 font-16 text-four">
                <q-select v-model="MEMBER.type_selected" @blur="$v.MEMBER.instead_post.$touch()" :error="$v.MEMBER.instead_post.$error" :options="MEMBER.type" />
              </q-field>
            </div>
            <!-- below are second clues -->
            <!-- add members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'add'">
              <q-field class="col-8 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="MEMBER.add_selected" :options="MEMBER.memberList"></q-select>
              </q-field>
            </div>
            <!-- delete members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'delete'">
              <q-field class="col-8 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="MEMBER.delete_selected" :options="MEMBER.memberList"></q-select>
              </q-field>
            </div>
            <!-- instead members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'instead'">
              <q-field class="col-4 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_PRE')">
                <q-select chips multiple filter v-model="MEMBER.instead_pre" :options="MEMBER.memberList"></q-select>
              </q-field>
              <q-field class="col-4 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_POST')">
                <q-select chips multiple filter v-model="MEMBER.instead_post" :options="delegateList"></q-select>
              </q-field>
            </div>
            <member-indicator :type="countedType"></member-indicator>
          </div>

          <!-- TODO: -->
          <!-- below is bancor init page -->
          <new-bancor v-if="this.first_type === 'new_b'" :supportBalances="BANCOR.supportBalances" :balanceSheet="balanceSheet" :userInfo="userInfo" @send="envaluePackage"></new-bancor>

          <div class="row col-12" v-show="this.first_type !== null">
            <q-field v-if="secondSignature" class="col-6 font-16 text-four" :label="$t('TRS_TYPE_SECOND_PASSWORD')+':'" :label-width="3">
              <q-input v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
            </q-field>
          </div>
        </q-card-main>
  
        <q-card-main v-show="this.first_type !== null" key="agreement">
          <q-checkbox color="secondary" v-model="agreeOptions" val="one" readonly>
            <a class="agreeBtn text-secondary" @click="showAgreement">{{$t('LAUNCH_MODAL.READ_TIP1')}}</a>
          </q-checkbox>
          <br><br>
          <q-checkbox color="secondary" v-model="agreeOptions" val="two" :label="$t('LAUNCH_MODAL.READ_TIP2')" />
          <div class="row justify-center margin-top-20">
            <q-btn color="secondary" class="col-4" size="md" @click="launchProposal" :label="$t('proposal.BTN_LAUNCH')" :disabled='this.disableLaunch'></q-btn>
          </div>
        </q-card-main>
      </transition-group>
    </q-card>
    <user-agreement-modal :show="userAgreementShow" @confirm="confirm" @cancel="userAgreementShow=false" :title="$t('ERR_READ_ALL')" :tips="''" :content="$t('AGREEMENT_ASSET_CONTENT')" />
  </q-page>
</template>

<script>
import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import { secondPwd, proposalTitleReg, assetSymbolReg, gatewayNameReg } from '../utils/validators'
import { toast, translateErrMsg } from '../utils/util'
import MemberIndicator from '../components/MemberIndicator'
import UserAgreementModal from '../components/UserAgreementModal'
import ClaimGateway from '../components/ProposalsSnippets/ClaimGateway'
import FreezeGateway from '../components/ProposalsSnippets/FreezeGateway'
import InitGateway from '../components/ProposalsSnippets/InitGateway'
import MemberChange from '../components/ProposalsSnippets/MemberChange'
import NewBancor from '../components/ProposalsSnippets/NewBancor'
import NewGateway from '../components/ProposalsSnippets/NewGateway'
import {
  QField,
  QModal,
  QInput,
  QCard,
  QCardMain,
  QCardTitle,
  QCardSeparator,
  QSelect,
  QCheckbox,
  QDatetime,
  QChipsInput,
  QIcon,
  QPage,
  QBtn,
  date
} from 'quasar'

let tomorrow = date.addToDate(new Date(), {
  days: 1
})
export default {
  name: 'ProposalLaunch',
  components: {
    QField,
    QModal,
    QInput,
    QCard,
    QCardMain,
    QCardTitle,
    QCardSeparator,
    QSelect,
    QCheckbox,
    QDatetime,
    QChipsInput,
    QIcon,
    QPage,
    QBtn,
    MemberIndicator,
    UserAgreementModal,
    ClaimGateway,
    FreezeGateway,
    InitGateway,
    MemberChange,
    NewBancor,
    NewGateway
  },
  props: ['show'],
  data() {
    return {
      pack: null,
      secondPwd: '',
      userAgreementShow: false,
      balanceSheet: [],
      // overall setting
      p_title: null,
      first_type: null,
      p_time_start: null,
      p_time_end: null,
      p_selected: {
        name: ''
      },
      second_type: null,
      // cannot init
      // TODO NEED DELETE BELOW
      initFalse: true,
      agreeOptions: [],
      // options for total
      proposalType: [
        // protential of council options
        // {
        //   label: this.$t('proposal.SELECT_NEWCOUNCIL'),
        //   value: 'new'
        // },
        // {
        //   label: this.$t('proposal.SELECT_CHANGECOUNCIL'),
        //   value: 'change'
        // },
        // {
        //   label: this.$t('proposal.SELECT_CHANGEPERIOD'),
        //   value: 'period'
        // },
        // {
        //   label: this.$t('proposal.SELECT_REMOVECOUNCIL'),
        //   value: 'remove'
        // },
        {
          label: this.$t('proposal.SELECT_NEWNET'),
          value: 'new_n'
        },
        {
          label: this.$t('proposal.SELECT_INITNET'),
          value: 'init'
        },
        {
          label: this.$t('proposal.SELECT_CHANGEMEMBER'),
          value: 'member_n'
        },
        {
          label: this.$t('proposal.NETGATEWAY_FREEZE'),
          value: 'gateway_freeze'
        },
        {
          label: this.$t('proposal.NETGATEWAY_CLEAR'),
          value: 'gateway_clear'
        },
        {
          label: this.$t('proposal.SELECT_NEWBANCOR'),
          value: 'new_b'
        }
        // {
        //   label: this.$t('proposal.SELECT_NETPERIOD'),
        //   value: 'period_n'
        // },
        // {
        //   label: this.$t('proposal.SELECT_NETMEMBER'),
        //   value: 'member_n'
        // }
      ],
      proposalType_sec: [
        {
          label: this.$t('proposal.SELECT_REMOVECOUNCIL'),
          value: 'remove'
        },
        {
          label: this.$t('proposal.SELECT_CHANGEPERIOD'),
          value: 'period'
        },
        {
          label: this.$t('proposal.SELECT_CHANGEMEMBER'),
          value: 'member'
        }
      ],
      proposalType_sec_n: [
        // protential canceled
        // {
        //   label: this.$t('proposal.SELECT_NETPERIOD'),
        //   value: 'period_n'
        // },
        {
          label: this.$t('proposal.SELECT_INITNET'),
          value: 'init'
        },
        {
          label: this.$t('proposal.SELECT_NETMEMBER'),
          value: 'member_n'
        }
      ],
      councilList: [],
      netList: [],
      delegateList: [],
      brief: null,
      NEW: {
        memberList: [],
        memberNumber: null,
        selected: [],
        period: null,
        agreement: [],
        // NET SCOPE
        name: null,
        currency: null,
        currencyBrief: null,
        currencyPrecision: null
      },
      INIT: {
        selected: []
      },
      REMOVE: {},
      PERIOD: {
        pre: 0,
        post: 0
      },
      MEMBER: {
        type: [
          {
            label: this.$t('proposal.SELECT_MEMBER_ADD'),
            value: 'add'
          },
          {
            label: this.$t('proposal.SELECT_MEMBER_DELETE'),
            value: 'delete'
          },
          {
            label: this.$t('proposal.SELECT_MEMBER_INSTEAD'),
            value: 'instead'
          }
        ],
        type_selected: null,
        added: [],
        removed: [],
        electedList: [],
        unelectedList: [],
        add_selected: [],
        delete_selected: [],
        instead_pre: [],
        instead_post: [],
        memberList: [],
        show_pre: [],
        show_post: [],
        clear: []
      },
      CLEAR: {
        selected: []
      },
      BANCOR: {
        // form lists
        allCurrency: [],
        activedList: [],
        pair_pre: '',
        pair_post: '',
        // hidden stuff
        supportBalances: [],
        moneyAble: ['XAS', 'BCH'],
        // content
        money: '',
        stock: '',
        moneyBalance: '',
        stockBalance: '',
        supply: '',
        stockCw: null,
        moneyCw: null,
        moneyPrecision: null,
        stockPrecision: null,
        name: '',
        owner: ''
      },
      typeMap: {
        new_n: 'gateway_register',
        init: 'gateway_init',
        period_n: 'gateway_period',
        member_n: 'gateway_update_member',
        new: 'council_register',
        change: 'council_update_mumber',
        period: 'council_update',
        remove: 'council_revoke',
        gateway_freeze: 'gateway_revoke',
        new_b: 'bancor_init',
        gateway_clear: 'gateway_claim'
      },
      tomorrow
    }
  },
  validations: {
    secondPwd: {
      secondPwd: secondPwd()
    },
    p_title: {
      required,
      isTested(val) {
        return proposalTitleReg.test(val)
      }
    },
    first_type: {
      required
    },
    p_selected: {
      required,
      isSelected() {
        if (this.first_type === 'init' || this.first_type === 'member_n') {
          if (this.$v.p_selected.$dirty !== false) {
            return false
          }
          return true
        }
        return false
      }
    },
    p_time_start: {
      required
    },
    p_time_end: {
      required
    },
    brief: {
      required,
      minLength: minLength(50),
      maxLength: maxLength(1000)
    },
    second_type: {
      test(val) {
        if (
          this.first_type !== 'new' &&
          this.first_type !== 'new_n' &&
          this.first_type !== null &&
          this.$v.second_type.$dirty !== false
        ) {
          if (val === null) {
            return true
          }
          return false
        }
        return false
      }
    },
    NEW: {
      memberNumber: {
        required,
        minValue: minValue(3),
        maxValue: maxValue(33)
      },
      selected: {
        required,
        ifEnough(val) {
          // to see whether should use the
          if (this.NEW.memberNumber !== val.length && this.$v.NEW.selected.$dirty !== false) {
            return true
          }
          return false
        }
      },
      period: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(30)
      },
      // NET SCOPE
      name: {
        required,
        reg(val) {
          return gatewayNameReg.test(val)
        }
      },
      currency: {
        required,
        reg(val) {
          return assetSymbolReg.test(val)
        }
      },
      currencyPrecision: {
        required,
        minValue: minValue(0),
        maxValue: maxValue(16)
      },
      currencyBrief: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(256)
      }
    },
    PERIOD: {
      post: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(30)
      }
    },
    MEMBER: {
      instead_post: {
        required
      }
    },
    REMOVE: {}
  },
  mounted() {},
  methods: {
    ...mapActions([
      'postProposal',
      'getGateways',
      'getGatewayDelegates',
      'getBancorSupports',
      'getBalances'
    ]),
    hideModal() {
      this.resetHeader()
      this.$v.$reset()
      this.$router.back()
    },
    // compile the proposal content
    async launchProposal() {
      let obj = {}
      obj.content = this.pack.pack
      obj.title = this.p_title
      obj.desc = this.pack.brief
      obj.topic = this.countedType
      obj.endHeight = this.endHeight
      obj.secondPwd = this.secondPwd
      let result = await this.postProposal(obj)
      if (result.success) {
        toast(this.$t('LAUNCH_MODAL.LAUNCH_SUCCESS'))
        this.hideModal()
      } else {
        translateErrMsg(this.$t, result.error)
      }
    },
    // info get funcs
    async getAllGate() {
      let res = await this.getGateways()
      let ls = []
      if (this.first_type === 'member_n') {
        res.gateways.forEach(o => {
          if (o.validatorNumber > 0) {
            return ls.push({
              label: o.name,
              value: o
            })
          }
        })
      } else if (this.first_type === 'gateway_clear') {
        res.gateways.forEach(o => {
          if (o.revoked === 1) {
            return ls.push({
              label: o.name,
              value: o
            })
          }
        })
      } else if (this.first_type === 'gateway_freeze') {
        res.gateways.forEach(o => {
          if (o.revoked === 0 && o.activated === 1) {
            return ls.push({
              label: o.name,
              value: o
            })
          }
        })
      } else if (this.first_type === 'init') {
        res.gateways.forEach(o => {
          if (o.activated === 0 && o.revoked === 0) {
            return ls.push({
              label: o.name,
              value: o
            })
          }
        })
      } else {
        res.gateways.forEach(o => {
          return ls.push({
            label: o.name,
            value: o
          })
        })
      }
      this.netList = ls
    },
    async getAllDelegates() {
      // params :  filter
      // 0 for none elected
      // 1 for elected
      // 2 for all
      // params : obj for the state this response to replace
      let res = await this.getGatewayDelegates({
        name: this.p_selected.name
      })
      return res
    },
    // to form init list
    async formInitList() {
      let that = this
      let res = await this.getGatewayDelegates({
        name: this.p_selected.name
      })
      let ls = []
      this.initFalse = true
      res.validators.forEach(o => {
        // cannot init detect
        if (o.elected === 1) {
          that.initFalse = false
          return
        }
        return ls.push({
          label: o.name,
          value: o.address
        })
      })
      this.delegateList = ls
    },
    async formMemberList() {
      let res = await this.getGatewayDelegates({
        name: this.p_selected.name
      })
      let total = []
      let elected = []
      let unelected = []
      res.validators.forEach(o => {
        // cannot init detect
        if (o.elected === 1) {
          return elected.push({
            label: o.name,
            value: o
          })
        }
      })
      res.validators.forEach(o => {
        // cannot init detect
        if (o.elected === 0) {
          return unelected.push({
            label: o.name,
            value: o
          })
        }
      })
      res.validators.forEach(o => {
        return total.push({
          label: o.name,
          value: o
        })
      })
      this.MEMBER.electedList = elected
      this.MEMBER.unelectedList = unelected
      this.delegateList = total
    },
    async getBancorSupportList() {
      let result = await this.getBancorSupports()
      if (result.success) {
        // this.BANCOR.supportBalances = result.data
        let tempArr = []
        // let tempObj = {}
        result.data.forEach(e => {
          // tempObj.label = e.assetName
          // tempObj.value = e
          tempArr.push({
            label: e.assetName,
            value: e
          })
        })
        this.BANCOR.supportBalances = tempArr
      }
    },
    async getBalance() {
      let result = await this.getBalances({
        address: this.userInfo.address
      })
      let tempArr = []
      tempArr['XAS'] = {
        precision: 8,
        balance: this.userInfo.account.xas
      }
      if (result.success) {
        result.balances.forEach(e => {
          // if e.flag === 2
          tempArr[e.currency] = {
            balance: e.balance,
            precision: e.asset.precision
          }
        })
        this.balanceSheet = tempArr
      }
    },
    envaluePackage(pack) {
      this.pack = pack
    },
    resetHeader() {
      this.pack = null
      this.p_title = null
      this.first_type = null
      this.p_time_start = null
      this.p_time_end = null
      this.p_selected = {
        name: ''
      }
      this.secondPwd = ''
    },
    showAgreement() {
      this.userAgreementShow = true
    },
    confirm() {
      this.userAgreementShow = false
      if (this.agreeOptions.indexOf('one') < 0) {
        this.agreeOptions.push('one')
      }
    },
    getCurrency() {
      // TODO: GET ALL BANCOR CONNECTED CURRENCY
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    // REFINE NEW COMP
    btnAble() {
      if (this.secondSignature) {
        if (
          !this.$v.p_title.$invalid &&
          !this.$v.first_type.$invalid &&
          !this.$v.p_time_end.$invalid &&
          !this.$v.secondPwd.$invalid &&
          this.pack !== null
        ) {
          return true
        }
        return false
      } else {
        if (
          !this.$v.p_title.$invalid &&
          !this.$v.first_type.$invalid &&
          !this.$v.p_time_end.$invalid &&
          this.pack !== null
        ) {
          return true
        }
        return false
      }
    },
    proposalLaunchClass() {
      return this.isDesk ? 'padding-suit q-mx-xl q-my-xl' : 'row col-12 padding-suit margin-top-20'
    },
    secondSignature() {
      return this.userInfo ? this.userInfo.account.secondPublicKey : null
    },
    countedType() {
      return this.typeMap[this.first_type]
    },
    endHeight() {
      let currentHeight = this.userInfo.latestBlock.height
      let pre = new Date().getTime()
      let post = new Date(this.p_time_end).getTime()
      let shift = (post - pre) / 10000
      return Math.round(currentHeight + shift)
    },
    disableLaunch() {
      if (this.agreeOptions.length === 2 && this.btnAble) {
        return false
      }
      return true
    },
    afterList() {
      let space = []
      let removenamespace = []
      if (this.MEMBER.electedList.length > 0 && this.MEMBER.removed.length > 0) {
        this.MEMBER.removed.forEach(o => {
          return removenamespace.push(o.name)
        })
        this.MEMBER.electedList.forEach(o => {
          if (this._.indexOf(removenamespace, o.label) < 0) {
            // not found:
            return space.push(o)
          }
        })
      }
      if (this.MEMBER.electedList.length > 0 && this.MEMBER.added.length > 0) {
        this.MEMBER.added.forEach(o => {
          space.push({
            label: o.name,
            value: o
          })
        })
      }
      return space
    },
    gatewayMember() {
      if (this.p_selected && this.p_selected.minimumMembers) {
        return this.p_selected.minimumMembers
      }
      return 0
    }
  },
  watch: {
    first_type(val) {
      if (
        val === 'init' ||
        val === 'member_n' ||
        val === 'gateway_freeze' ||
        val === 'gateway_clear'
      ) {
        this.getAllGate()
      }
      if (val === 'new_b') {
        this.getCurrency()
        this.getBancorSupportList()
        this.getBalance()
      }
    },
    p_selected(val) {
      if (this.first_type === 'init') {
        this.formInitList()
      } else if (this.first_type === 'member_n' || this.first_type === 'gateway_clear') {
        this.formMemberList()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.no-border-top {
  margin-top: 0 !important;
}

.padding-suit {
  padding: 20px;
}

.agreeBtn {
  text-decoration: none;
  margin-left: 8px;
}

.gateway-claim {
  div {
    padding-top: 6px;
  }
}
</style>