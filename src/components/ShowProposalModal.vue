<template>
  <q-modal v-model="show" maximized no-esc-dismiss>
      <q-card class="layout-padding q-mx-xl q-my-xl">
        <q-card-title>{{$t('proposal.SHOW')}}
          <q-btn color="warning" slot="right" class="row items-center" @click="hideModal">
            <q-icon name="place" /> {{$t('CANCEL')}}
          </q-btn>
        </q-card-title>
        <div class="row ">
          <q-field :label-width="2" :label="$t('proposal.SELECT_P_TITLE')" class="col-8">
            <q-input readonly hide-underline v-model="p_title" />
          </q-field>
        </div>
        <div class="row">
          <q-field :label-width="3"  :label="$t('proposal.SELECT_P_TYPE')" class="col-4">
            <q-input readonly hide-underline v-model="p_title" />
            <!-- <q-select v-model="p_type" :options="proposalType"/> -->
          </q-field>
        </div>
        <div class="row">
          <q-field :label-width="4"  :label="$t('proposal.SELECT_P_PERIOD')" class="col-3">
            <!-- <q-datetime min="2018-04-05" v-model="p_time_start"/> -->
            <q-input readonly hide-underline v-model="p_title" />
          </q-field>
          <span class="self-center col-1">至</span>
          <q-field class="col-3 q-ml-xl">
            <!-- <q-datetime v-model="p_time_end"/> -->
            <q-input readonly hide-underline v-model="p_title" />
          </q-field>
        </div>
        <q-card-separator class="q-my-lg" />
        <transition-group
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >

        <q-card-main key="content">
          <!-- below is new page -->
          <div v-show="this.p_type === 'new'" id="new" class="">
            <div class="row">
              <q-field class="block col-2" label-width="8" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input min=5 max=33 type="number" v-model="NEW.memberNumber" :suffix="$t('LAUNCH_MODAL.PERSON')"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-8" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-select chips multiple filter v-model="NEW.selected" :options="NEW.memberList"></q-select>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-2" label-width="8" :label="$t('LAUNCH_MODAL.PERIOD')">
                <q-input type="number" v-model="NEW.period" :suffix="$t('LAUNCH_MODAL.DAY')"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-8" label-width="2" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input type="textarea" v-model="NEW.brief" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is remove page -->
          <div v-show="this.p_type === 'remove'" id="remove">
            <div class="row">
              <q-field class="col-9" label-width="2" :label="$t('LAUNCH_MODAL.REMOVE_REASON')">
                <q-input type="textarea" v-model="REMOVE.brief" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is period page -->
          <div v-show="this.p_type === 'period'" id="remove">
            <div class="row">
              <q-field :label-width="4"  :label="$t('proposal.SELECT_P_PERIOD')" class="col-3">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" v-model="PERIOD.pre"/>
              </q-field>
              <span class="self-center col-1">TO</span>
              <q-field class="col-3 q-ml-xl">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" v-model="PERIOD.post"/>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9" label-width="2" :label="$t('LAUNCH_MODAL.PERIOD_REASON')">
                <q-input type="textarea" v-model="PERIOD.brief" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is member page -->
          <div v-show="this.p_type === 'member'" id="remove">
            <div class="row">
              <q-field :label-width="4"  :label="$t('proposal.SELECT_MEMBER_ACTION')" class="col-3">
                <q-select v-model="MEMBER.type_selected" :options="MEMBER.type"/>
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

        <q-card-main key="agreement">
          <div class="row justify-center">
            <q-btn color="primary" size="md" :label="$t('proposal.BTN_VOTE')"></q-btn>
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

export default {
  name: 'LaunchProposalModal',
  props: ['show'],
  data() {
    return {
      p_type: null,
      p_title: null,
      p_time_start: null,
      p_time_end: null,
      p_selected: {},
      proposalType: [
        {
          label: this.$t('proposal.SELECT_NEWCOUNCIL'),
          value: 'new'
        },
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
      councilList: [],
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
        agreement: []
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
  methods: {
    hideModal() {
      this.$emit('hide')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>