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
            <q-select v-model="first_type" :options="proposalType" @blur="$v.first_type.$touch()" :error="$v.first_type.$error"/>
          </q-field>
          <q-field class="col-4 q-ml-lg" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type === 'change'">
            <q-select v-model="p_selected" :options="councilList" @blur="$v.p_selected.$touch()" :error="$v.p_selected.$error" :placeholder="$t('proposal.SELECT_P_COUNCIL')"/>
          </q-field>
          <q-field class="col-4 q-ml-lg" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type === 'change_n'">
            <q-select v-model="p_selected" :options="netList" @blur="$v.p_selected.$touch()" :error="$v.p_selected.$error" :placeholder="$t('proposal.SELECT_P_NET')"/>
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
                <q-input type="textarea" v-model="NEW.brief" @blur="$v.NEW.brief.$touch()" :error="$v.NEW.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
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
                <q-input :float-label="$t('PRECISION')" upper-case type="number" v-model="NEW.currencyPrecision" @blur="$v.NEW.currencyPrecision.$touch()" :error="$v.NEW.currencyPrecision.$error"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.CURRENCY_BRIEF_TIP')" :label="$t('LAUNCH_MODAL.CURRENCY_BRIEF')">
                <q-input :float-label="$t('LAUNCH_MODAL.NET_NEW_LABEL')" upper-case type="text" v-model="NEW.currencyBrief" @blur="$v.NEW.currencyBrief.$touch()" :error="$v.NEW.currencyBrief.$error"></q-input>
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
                <q-input type="textarea" v-model="NEW.brief" @blur="$v.NEW.brief.$touch()" :error="$v.NEW.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is net init page -->
          <div class="col-12" v-show="this.second_type === 'init' && this.first_type === 'change_n'" id="init">
            <div class="row">
              <q-field class="col-8" label-width="2" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-select chips multiple filter v-model="INIT.selected" @blur="$v.INIT.selected.$touch()" :error="$v.INIT.selected.ifEnough" :options="NEW.memberList"></q-select>
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
                <q-input type="textarea" v-model="PERIOD.brief" @blur="$v.PERIOD.brief.$touch()" :error="$v.PERIOD.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is net member page -->
          <div class="col-12" v-show="this.second_type === 'member_n' && this.first_type === 'change_n'" id="remove">
            <!-- instead members -->
            <div class="row">
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

          <!-- below is remove page -->
          <div class="col-12" v-show="this.second_type === 'remove' && this.first_type === 'change'" id="remove">
            <div class="">
              <q-field class="" label-width="1" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.REMOVE_REASON')">
                <q-input type="textarea" v-model="REMOVE.brief" @blur="$v.REMOVE.brief.$touch()" :error="$v.REMOVE.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
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
                <q-input type="textarea" v-model="PERIOD.brief" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is member page -->
          <div class="col-12" v-show="this.second_type === 'member' && this.first_type === 'change'" id="remove">
            <div class="row">
              <q-field :label-width="4" :error-label="$t('ERR.ERR_REQUIRE_TYPE')"  :label="$t('proposal.SELECT_MEMBER_ACTION')" class="col-3">
                <q-select v-model="MEMBER.type_selected" @blur="$v.MEMBER.type_selected.$touch()" :error="$v.MEMBER.type_selected.$error" :options="MEMBER.type"/>
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
        </q-card-main>

        <q-card-main v-show="this.first_type !== null" key="agreement">
          <q-checkbox v-model="NEW.agreement" val="one" :label="$t('LAUNCH_MODAL.READ_TIP1')" />
          <br><br>
          <q-checkbox v-model="NEW.agreement" val="two" :label="$t('LAUNCH_MODAL.READ_TIP2')" />
          <div class="row justify-center">
            <q-btn color="primary" size="md" @click="launchProposal" :label="$t('proposal.BTN_LAUNCH')"></q-btn>
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
  QChipsInput
} from 'quasar'
import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import { getCache } from '../utils/util'

export default {
  name: 'LaunchProposalModal',
  props: ['show'],
  data() {
    return {
      // overall setting
      p_title: null,
      first_type: null,
      second_type: null,
      p_time_start: null,
      p_time_end: null,
      p_selected: {},
      P_CHANGE_TYPE: null,
      // net proposal
      p_type_n: null,
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
      NEW: {
        memberList: [
          {
            label: 'Jonny',
            value: 'jonny'
          },
          {
            label: 'Docky',
            value: 'dockey'
          }
        ],
        memberNumber: null,
        selected: [],
        period: null,
        brief: null,
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
      REMOVE: {
        brief: null
      },
      PERIOD: {
        pre: null,
        post: null,
        brief: null
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
    p_title: {
      required,
      maxLength: maxLength(30),
      minLength: minLength(5)
    },
    first_type: {
      required
    },
    p_selected: {
      required: () => {
        if (this.first_type === 'change' || this.first_type === 'change_n') {
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
    second_type: {
      test(val) {
        if (this.first_type !== 'new' && this.first_type !== 'new_n' && this.first_type !== null && this.first_type !== null && this.$v.second_type.$dirty !== false) {
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
          console.log(this.NEW.memberNumber, val.length, this.$v)
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
      brief: {
        required,
        minLength: minLength(50),
        maxLength: maxLength(1000)
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
      },
      brief: {
        required,
        minLength: minLength(50),
        maxLength: maxLength(1000)
      }
    },
    MEMBER: {
      type_selected: {
        required
      }
    },
    REMOVE: {
      brief: {
        required,
        minLength: minLength(50),
        maxLength: maxLength(1000)
      }
    }
  },
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
    QChipsInput
  },
  mounted() {
  },
  methods: {
    ...mapActions(['postProposal']),
    hideModal() {
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
        this.p_desc = this.NEW.brief
        debugger
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
            gateway: this.p_selected.symbol,
            members: this.INIT.selected
          }
        } else if (this.second_type === 'period_n') {
          // this.p_desc = this.PERIOD.brief
          // content = {
          //   field: 'updateInterval',
          //   from: this.PERIOD.pre,
          //   to: this.PERIOD.post
          // }
        } else {
          this.p_desc = this.MEMBER.brief
          content = {
            // TODO need getway member list
            gateway: this.p_selected.symbol,
            from: this.MEMBER.instead_pre,
            to: this.MEMBER.instead_post
          }
        }
      }
      return JSON.stringify(content)
    },
    launchProposal() {
      console.log(this.p_time_start, this.p_time_end, this.endHeight)
      let obj = {}
      obj.content = this.compileContent()
      obj.title = this.p_title
      obj.desc = this.p_desc
      obj.topic = this.countedType
      obj.endHeight = this.endHeight
      debugger
      this.postProposal(obj)
    }
  },
  computed: {
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
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
