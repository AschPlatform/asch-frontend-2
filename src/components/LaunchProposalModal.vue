<template>
  <q-modal v-model="show" maximized no-esc-dismiss>
      <q-card class="layout-padding q-mx-xl q-my-xl">
        <q-card-title>{{$t('proposal.LAUNCH')}}
          <q-btn color="warning" slot="right" class="row items-center" @click="hideModal">
            <q-icon name="place" /> {{$t('CANCEL')}}
          </q-btn>
        </q-card-title>
        <div class="row">
          <q-field :error-label="$t('ERR.ERR_5_30')" :label-width="2" :label="$t('proposal.SELECT_P_TITLE')" class="col-8">
            <q-input v-model="p_title" @focus="$v.p_title.$reset()" @blur="$v.p_title.$touch()" :error="$v.p_title.$error"/>
          </q-field>
        </div>
        <div class="row">
          <q-field :label-width="3" :error-label="$t('ERR.ERR_REQUIRE_TYPE')" :label="$t('proposal.SELECT_P_TYPE')" class="col-4">
            <q-select v-model="first_type" :options="proposalType" @change="detectChange" @blur="$v.first_type.$touch()" :error="$v.first_type.$error"/>
          </q-field>
          <q-field class="col-4 q-ml-lg" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type === 'change'">
            <q-select v-model="p_selected" :options="councilList" @blur="$v.p_selected.$touch()" :error="$v.p_selected.$error" :placeholder="$t('proposal.SELECT_P_COUNCIL')"/>
          </q-field>
          <q-field class="col-4 q-ml-lg" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type === 'change_n'">
            <q-select v-model="p_selected" :options="netList" @change="val => {console.log(val)}" @blur="$v.p_selected.$touch()" :error="$v.p_selected.isSelected" :placeholder="$t('proposal.SELECT_P_NET')"/>
          </q-field>
        </div>
        <div class="row">
          <q-field :label-width="4" :error-label="$t('ERR.ERR_REQUIRE_TIME')"  :label="$t('proposal.SELECT_P_PERIOD')" class="col-3">
            <q-datetime min="2018-04-05" v-model="p_time_start" @blur="$v.p_time_start.$touch()" :error="$v.p_time_start.$error"/>
          </q-field>
          <span class="self-center col-1" align="center">至</span>
          <q-field class="col-3 q-ml-xl" :error-label="$t('ERR.ERR_REQUIRE_TIME')">
            <q-datetime v-model="p_time_end" @blur="$v.p_time_end.$touch()" :error="$v.p_time_end.$error"/>
          </q-field>
        </div>
        <q-card-separator class="q-my-lg"/>
        <transition-group
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >

        <q-card-main key="content" class="row">
          <q-field v-show="this.first_type !== 'new' && this.first_type !== 'new_n' && this.first_type !== null && this.first_type !== null"
          :label-width="3"
          :label="$t('proposal.SELECT_P_TYPE')"
          class="col-4"
          :error-label="$t('ERR.ERR_REQUIRE_DETAIL')">
            <q-select v-model="second_type" :error="$v.second_type.test" :options="this.first_type === 'change' ? proposalType_sec : proposalType_sec_n"/>
          </q-field>
          <!-- below is new page -->
          <div v-show="this.first_type === 'new'" id="new" class="col-8">
            <div class="row">
              <q-field class="block col-6" label-width="4" :error-label="$t('ERR.ERR_REQUIRE_NUMBER')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input min=7 max=33 type="number" v-model="NEW.memberNumber" @blur="$v.NEW.memberNumber.$touch()" :error="$v.NEW.memberNumber.$error" :suffix="$t('LAUNCH_MODAL.PERSON')"></q-input>
              </q-field>
            </div>
            <div class="">
              <q-field class="col-8" label-width="2" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="NEW.selected" @blur="$v.NEW.selected.$touch()" :error="$v.NEW.selected.ifEnough" :options="NEW.memberList"></q-select>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-6" label-width="4" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD')">
                <q-input type="number" v-model="NEW.period" @blur="$v.NEW.period.$touch()" :error="$v.NEW.period.$error" :suffix="$t('LAUNCH_MODAL.DAY')"></q-input>
              </q-field>
            </div>
            <div class="">
              <q-field class="col-8" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is net new page -->
          <div class="col-12" v-show="this.first_type === 'new_n'" id="new">
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('ERR.ERR_3_15')" :label="$t('LAUNCH_MODAL.NET_NAME')">
                <q-input type="text" v-model="NEW.name" @blur="$v.NEW.name.$touch()" :error="$v.NEW.name.$error"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.NET_CURRENCY_TIP')" :label="$t('LAUNCH_MODAL.NET_CURRENCY')">
                <q-input :float-label="$t('LAUNCH_MODAL.NET_NEW_LABEL')" upper-case type="text" v-model="NEW.currency" @blur="$v.NEW.currency.$touch()" :error="$v.NEW.currency.$error"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.PRECISION_TIP')" :label="$t('PRECISION')">
                <q-input upper-case type="number" v-model="NEW.currencyPrecision" @blur="$v.NEW.currencyPrecision.$touch()" :error="$v.NEW.currencyPrecision.$error"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.CURRENCY_BRIEF_TIP')" :label="$t('LAUNCH_MODAL.CURRENCY_BRIEF')">
                <q-input type="text" v-model="NEW.currencyBrief" @blur="$v.NEW.currencyBrief.$touch()" :error="$v.NEW.currencyBrief.$error"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-2" label-width="8" :error-label="$t('ERR.ERR_3_15')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input type="number" v-model="NEW.memberNumber" @blur="$v.NEW.memberNumber.$touch()" :error="$v.NEW.memberNumber.$error" :suffix="$t('LAUNCH_MODAL.PERSON')"></q-input>
              </q-field>
            </div>
            <!-- <div class="row">
              <q-field class="col-8" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-select chips multiple filter v-model="NEW.selected" :options="NEW.memberList"></q-select>
              </q-field>
            </div> -->
            <div class="row">
              <q-field class="col-2" label-width="8" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD_NET')">
                <q-input type="number" v-model="NEW.period" @blur="$v.NEW.period.$touch()" :error="$v.NEW.period.$error" :suffix="$t('LAUNCH_MODAL.DAY')"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-8" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is net init page -->
          <div class="col-12" v-show="this.second_type === 'init' && this.first_type === 'change_n' && this.initFalse" id="init">
            <div class="row">
              <q-field class="col-8" label-width="2" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-select chips multiple filter v-model="INIT.selected" @input="detectChange" @blur="$v.INIT.selected.$touch()" :error="$v.INIT.selected.ifEnough" :options="delegateList"></q-select>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.INIT_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is net period page -->
          <div class="col-12" v-show="this.second_type === 'period_n' && this.first_type === 'change_n'" id="remove">
            <div class="row">
              <q-field :label-width="4"  :label="$t('LAUNCH_MODAL.NET_PERIOD')" class="col-3">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" disabled readonly v-model="PERIOD.pre"/>
              </q-field>
              <span class="self-center q-ml-lg">{{$t('LAUNCH_MODAL.INSTEAD_POST')}}</span>
              <q-field class="col-3 q-ml-xl" :error-label="$t('ERR.ERR_1_30')">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" v-model="PERIOD.post"/>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.PERIOD_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is net member page -->
          <div class="col-12" v-show="this.second_type === 'member_n' && this.first_type === 'change_n'" id="remove">
            <!-- instead members -->
            <div class="row">
              <!-- <q-field class="col-4" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_PRE')">
                <q-select chips multiple filter v-model="MEMBER.instead_pre" :options="MEMBER.memberList"></q-select>
              </q-field> -->
              <q-field class="col-4" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_POST')">
                <q-select chips multiple filter v-model="MEMBER.instead_post" :options="delegateList"></q-select>
              </q-field>
            </div>
            <div class="row justify-around q-my-lg">
              <q-chips-input color="primary" :prefix="$t('LAUNCH_MODAL.INSTEAD_PRE')" class="col-5" inverted readonly v-model="MEMBER.instead_pre" disable/>
              <q-icon size="33px" name="keyboard arrow right" />
              <q-chips-input color="primary" :prefix="$t('LAUNCH_MODAL.INSTEAD_POST')" class="col-5" inverted readonly v-model="MEMBER.instead_post" disable/>
            </div>
            <div class="">
              <q-field class="" label-width="1" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.MEMBER_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is remove page -->
          <div class="col-12" v-show="this.second_type === 'remove' && this.first_type === 'change'" id="remove">
            <div class="">
              <q-field class="" label-width="1" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.REMOVE_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is period page -->
          <div class="col-12" v-show="this.second_type === 'period' && this.first_type === 'change'" id="remove">
            <div class="row">
              <q-field :label-width="4"  :label="$t('proposal.SELECT_P_PERIOD')" class="col-3">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" disabled readonly v-model="PERIOD.pre"/>
              </q-field>
              <span class="self-center q-ml-lg">{{$t('LAUNCH_MODAL.INSTEAD_POST')}}</span>
              <q-field class="col-3 q-ml-xl" :error-label="$t('ERR.ERR_1_30')">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" v-model="PERIOD.post"/>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.PERIOD_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is member page -->
          <div class="col-12" v-show="this.second_type === 'member' && this.first_type === 'change'" id="remove">
            <div class="row">
              <q-field :label-width="4" :error-label="$t('ERR.ERR_REQUIRE_TYPE')"  :label="$t('proposal.SELECT_MEMBER_ACTION')" class="col-3">
                <q-select v-model="MEMBER.type_selected" @blur="$v.MEMBER.instead_post.$touch()" :error="$v.MEMBER.instead_post.$error" :options="MEMBER.type"/>
              </q-field>
            </div>
             <!-- below are second clues -->
             <!-- add members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'add'">
              <q-field class="col-8" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="MEMBER.add_selected" :options="MEMBER.memberList"></q-select>
              </q-field>
            </div>
            <!-- delete members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'delete'">
              <q-field class="col-8" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="MEMBER.delete_selected" :options="MEMBER.memberList"></q-select>
              </q-field>
            </div>
            <!-- instead members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'instead'">
              <q-field class="col-4" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_PRE')">
                <q-select chips multiple filter v-model="MEMBER.instead_pre" :options="MEMBER.memberList"></q-select>
              </q-field>
              <q-field class="col-4" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_POST')">
                <q-select chips multiple filter v-model="MEMBER.instead_post" :options="delegateList"></q-select>
              </q-field>
            </div>
            <div class="row justify-around q-my-lg">
              <q-chips-input color="primary" :prefix="$t('LAUNCH_MODAL.INSTEAD_PRE')" class="col-5" inverted readonly v-model="MEMBER.show_pre" disable/>
              <q-icon size="33px" name="keyboard arrow right" />
              <q-chips-input color="primary" :prefix="$t('LAUNCH_MODAL.INSTEAD_POST')" class="col-5" inverted readonly v-model="MEMBER.show_post" disable/>
            </div>
          </div>
          <div class="row col-12">
            <q-field v-if="secondSignature" class="col-8"  :label="$t('TRS_TYPE_SECOND_PASSWORD')+':'" :label-width="2">
              <q-input v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
            </q-field>
          </div>
        </q-card-main>

        <q-card-main v-show="this.first_type !== null" key="agreement">
          <q-checkbox v-model="agreeOptions" val="one" :label="$t('LAUNCH_MODAL.READ_TIP1')" />
          <br><br>
          <q-checkbox v-model="agreeOptions" val="two" :label="$t('LAUNCH_MODAL.READ_TIP2')" />
          <div class="row justify-center">
            <q-btn color="primary" size="md" @click="launchProposal" :label="$t('proposal.BTN_LAUNCH')" :disabled='this.disableLaunch'></q-btn>
          </div>
        </q-card-main>
        </transition-group>
      </q-card>
  </q-modal>
</template>

<script>
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
  QBtn
} from 'quasar'
import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import { secondPwd } from '../utils/validators'
import { getCache, toastError, toast } from '../utils/util'

export default {
  name: 'LaunchProposalModal',
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
    QBtn
  },
  props: ['show'],
  data() {
    return {
      secondPwd: '',
      // overall setting
      p_title: null,
      first_type: null,
      p_time_start: null,
      p_time_end: null,
      p_selected: null,
      second_type: null,
      // cannot init
      initFalse: false,
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
        {
          label: this.$t('proposal.SELECT_NEWNET'),
          value: 'new_n'
        },
        {
          label: this.$t('proposal.SELECT_CHANGENET'),
          value: 'change_n'
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
        pre: null,
        post: null
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
        add_selected: [],
        delete_selected: [],
        instead_pre: [],
        instead_post: [],
        memberList: [],
        show_pre: [],
        show_post: []
      }
    }
  },
  validations: {
    secondPwd: {
      secondPwd: secondPwd()
    },
    p_title: {
      required,
      maxLength: maxLength(30),
      minLength: minLength(5)
    },
    first_type: {
      required
    },
    p_selected: {
      isSelected() {
        if (this.first_type === 'change' || this.first_type === 'change_n') {
          if (this.p_selected === null && this.$v.p_selected.$dirty !== false) {
            return true
          }
          return false
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
        minValue: minValue(7),
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
        minLength: minLength(3),
        maxLength: maxLength(15)
      },
      currency: {
        required
      },
      currencyPrecision: {
        required
      },
      currencyBrief: {
        required
      }
    },
    INIT: {
      selected: {
        required
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
    ...mapActions(['postProposal', 'getGateways', 'getGatewayDelegates']),
    hideModal() {
      this.resetHeader()
      this.resetDetail()
      this.$v.$reset()
      this.$emit('hide')
    },
    initInfo() {},
    // countedInterval(val) {
    //   return val * 8640
    // },
    // compile the proposal content
    compileContent() {
      let content = {}
      if (this.first_type === 'new_n') {
        // launch a new gateway
        this.p_desc = this.brief
        content = {
          name: this.NEW.name,
          desc: this.NEW.currencyBrief,
          updateInterval: this.countedInterval,
          minimumMembers: this.NEW.memberNumber,
          currency: {
            symbol: this.NEW.currency,
            desc: this.NEW.currencyBrief,
            precision: this.NEW.currencyPrecision
          }
        }
      } else if (this.first_type === 'change_n') {
        if (this.second_type === 'init') {
          this.p_desc = ''
          content = {
            // TODO need get gateway detail & members detail
            gateway: this.p_selected.name,
            members: this.INIT.selected,
            desc: this.brief
          }
        } else if (this.second_type === 'period_n') {
          // this.p_desc = this.PERIOD.brief
          // content = {
          //   field: 'updateInterval',
          //   from: this.PERIOD.pre,
          //   to: this.PERIOD.post
          // }
        } else {
          this.p_desc = this.brief
          content = {
            // TODO need getway member list
            gateway: this.p_selected.name,
            from: this.MEMBER.instead_pre,
            to: this.MEMBER.instead_post
          }
        }
      }
      return content
    },
    launchProposal() {
      if (this.first_type === 'new' || this.first_type === 'new_n') {
        let result = this.checkValidate(this.first_type)
        if (!result) {
          toastError(this.$t('LAUNCH_MODAL.ERR_INVALID_FORM'))
          return
        }
      } else {
        let result = this.checkValidate(this.second_type)
        if (!result) {
          toastError(this.$t('LAUNCH_MODAL.ERR_INVALID_FORM'))
          return
        }
      }
      let obj = {}
      obj.content = this.compileContent()
      obj.title = this.p_title
      obj.desc = this.brief
      obj.topic = this.countedType
      obj.endHeight = this.endHeight
      obj.secondPwd = this.secondPwd
      let result = this.postProposal(obj)
      if (result.success) {
        toast('LAUNCH_MODAL.LAUNCH_SUCCESS')
        this.hideModal()
      } else {
        toastError(result.error)
      }
    },
    // select component change func
    detectChange() {
    },
    // info get funcs
    async getAllGate() {
      let res = await this.getGateways()
      let ls = []
      this._.each(res.gateways, o => {
        return ls.push({
          label: o.name,
          value: o
        })
      })
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
      // let ls = []
      // if (filter === 1) {
      //   console.log('gonna adjust delegated')
      //   this._.each(res.validators, function (o) {
      //     if (o.elected === 1) {
      //       return ls.push({
      //         label: o.address,
      //         value: o.address
      //       })
      //     }
      //   })
      // } else if (filter === 2) {
      //   console.log('gonna get all delegated')
      //   this._.each(res.validators, function (o) {
      //     return ls.push({
      //       label: o.address,
      //       value: o.address
      //     })
      //   })
      // } else {
      //   console.log('gonna get unelected delegates')
      //   this._.each(res.validators, function (o) {
      //     if (o.elected === 0) {
      //       return ls.push({
      //         label: o.address,
      //         value: o.address
      //       })
      //     }
      //   })
      // }
      // if (obj1) {
      //   this[obj][obj1] = ls
      // }
      // this[obj] = ls
      // console.log(this['delegateList'])
    },
    // to form init list
    async formInitList() {
      let that = this
      let res = await this.getGatewayDelegates({
        name: this.p_selected.name
      })
      let ls = []
      this._.each(res.validators, o => {
        // cannot init detect
        if (o.elected === 1) {
          that.initFalse = false
          return
        }
        return ls.push({
          label: o.address,
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
      this._.each(res.validators, o => {
        // cannot init detect
        if (o.elected === 1) {
          return elected.push(o.address)
        }
      })
      this._.each(res.validators, o => {
        return total.push({
          label: o.address,
          value: o.address
        })
      })
      this.MEMBER.instead_pre = elected
      this.delegateList = total
    },
    checkValidate(action) {
      // total set first
      if (
        !this.$v.p_title.$invalid &&
        !this.$v.first_type.$invalid &&
        !this.$v.p_time_start.$invalid &&
        !this.$v.p_time_end.$invalid
      ) {
        switch (action) {
          // init gateway
          case 'init':
            if (
              !this.$v.p_selected.isSelected &&
              !this.$v.INIT.selected &&
              !this.$v.brief.$invalid
            ) {
              return true
            }
            return false
          // change member of gateway
          case 'member_n':
            if (
              !this.$v.p_selected.isSelected &&
              !this.$v.MEMBER.instead_post.$invalid &&
              !this.$v.brief.$invalid
            ) {
              return true
            }
            return false
          // new gateway proposal
          case 'new_n':
            if (
              !this.$v.NEW.name.$invalid &&
              !this.$v.NEW.currency.$invalid &&
              !this.$v.NEW.currencyPrecision.$invalid &&
              !this.$v.NEW.currencyBrief.$invalid &&
              !this.$v.NEW.memberNumber.$invalid &&
              !this.$v.NEW.period.$invalid &&
              !this.$v.brief.$invalid
            ) {
              return true
            }
            return false
        }
      }
      return false
    },
    resetHeader() {
      this.p_title = null
      this.first_type = null
      this.p_time_start = null
      this.p_time_end = null
      this.p_selected = null
      this.secondPwd = ''
    },
    resetDetail() {
      this.initFalse = false
      this.councilList = []
      this.netList = []
      this.delegateList = []
      this.brief = null
      this.NEW = {
        memberList: [],
        memberNumber: null,
        selected: [],
        period: null,
        agreement: [],
        name: null,
        currency: null,
        currencyBrief: null,
        currencyPrecision: null
      }
      this.INIT = {
        selected: []
      }
      this.PERIOD = {
        pre: null,
        post: null
      }
      this.MEMBER = {
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
        add_selected: [],
        delete_selected: [],
        instead_pre: [],
        instead_post: [],
        memberList: [],
        show_pre: [],
        show_post: []
      }
    }
  },
  computed: {
    secondSignature() {
      let user = getCache('user')
      return user ? user.account.secondPublicKey : null
    },
    countedType() {
      if (this.first_type === 'new_n') {
        return 'gateway_register'
      } else if (this.first_type === 'change_n') {
        switch (this.second_type) {
          case 'init':
            return 'gateway_init'
          case 'period_n':
            return 'gateway_period'
          case 'member_n':
            return 'gateway_member'
        }
      }
    },
    endHeight() {
      let currentHeight = getCache('user').latestBlock.height
      let pre = new Date(this.p_time_start).getTime()
      let post = new Date(this.p_time_end).getTime()
      let shift = (post - pre) / 10000
      return currentHeight + shift
    },
    countedInterval() {
      return Number(this.NEW.period) * 8640
    },
    disableLaunch() {
      if (this.agreeOptions.length === 2) {
        return false
      }
      return true
    }
  },
  watch: {
    first_type(val) {
      if (val === 'change_n') {
        this.getAllGate()
      }
    },
    second_type(val) {
      if (val === 'init') {
        this.formInitList()
      } else if (val === 'member_n') {
        this.formMemberList()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
