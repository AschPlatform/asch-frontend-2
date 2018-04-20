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
          <div v-show="this.type === 'new'" id="new" class="">
            <div class="row">
              <q-field class="block col-2" label-width="8" :label="$t('DETAIL_MODAL.MEMBER_NUMBER')">
                <q-input readonly hide-underline v-model="NEW.memberNumber" :suffix="$t('DETAIL_MODAL.PERSON')"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-8" label-width="2" :label="$t('DETAIL_MODAL.MEMBER_MEMBER')">
                <q-chips-input Disabled multiple v-model="NEW.selected"></q-chips-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-2" label-width="8" :label="$t('DETAIL_MODAL.PERIOD')">
                <q-input type="number" readonly hide-underline v-model="NEW.period" :suffix="$t('DETAIL_MODAL.DAY')"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-8" label-width="2" :label="$t('DETAIL_MODAL.BRIEF')">
                <q-input type="textarea" readonly hide-underline v-model="NEW.brief" :placeholder="$t('DETAIL_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is remove page -->
          <div v-show="this.type === 'remove'" id="remove">
            <div class="row">
              <q-field class="col-9" label-width="2" :label="$t('DETAIL_MODAL.REMOVE_TITLE')">
                <q-input readonly hide-underline v-model="REMOVE.title" :placeholder="$t('DETAIL_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9" label-width="2" :label="$t('DETAIL_MODAL.REMOVE_REASON')">
                <q-input readonly hide-underline type="textarea" v-model="REMOVE.brief" :placeholder="$t('DETAIL_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>

          <!-- below is period page -->
          <div v-show="this.type === 'period'" id="period">
            <div class="row">
              <q-field :label-width="4"  :label="$t('proposal.SELECT_P_PERIOD')" class="col-3">
                {{$t('DETAIL_MODAL.PERIOD_TITLE', {pre: PERIOD.pre, post: PERIOD.post})}}
                <!-- <q-input readonly v-bind="$t('DETAIL_MODAL.PERIOD_TITLE', {pre: PERIOD.pre, post: PERIOD.post})" hide-underline type="number"/> -->
              </q-field>
            </div>
          </div>

          <!-- below is member page -->
          <div v-show="this.type === 'member'" id="member">
            <div class="row">
              <q-field :label-width="4"  :label="$t('proposal.SELECT_MEMBER_ACTION')" class="col-3">
                <q-chips-input Disabled v-model="MEMBER.type_selected"/>
              </q-field>
            </div>
             <!-- below are second clues -->
             <!-- add members -->
            <div class="row" v-show="this.type === 'add'">
              <q-field class="col-8" label-width="2" :label="$t('DETAIL_MODAL.ADD_TITLE')">
                <q-chips-input Disabled multiple filter v-model="MEMBER.add_selected" :options="MEMBER.memberList"></q-chips-input>
              </q-field>
            </div>
            <!-- delete members -->
            <div class="row" v-show="this.type === 'delete'">
              <q-field class="col-8" label-width="2" :label="$t('DETAIL_MODAL.REMOVE_TITLE')">
                <q-chips-input Disabled multiple v-model="MEMBER.delete_selected" :options="MEMBER.memberList"></q-chips-input>
              </q-field>
            </div>
            <!-- instead members -->
            <div class="row justify-around q-my-lg" v-show="this.type === 'member'">
              <q-field class="col-2" label-width="8" :label="$t('DETAIL_MODAL.INSTEAD_TITLE_PRE')">
                <q-chips-input Disabled v-model="MEMBER.delete_selected"></q-chips-input>
              </q-field>
              <q-field class="col-2" label-width="8" :label="$t('DETAIL_MODAL.INSTEAD_TITLE_POST')">
                <q-chips-input Disabled v-model="MEMBER.add_selected"></q-chips-input>
              </q-field>
            </div>
            <!-- <div class="row justify-around q-my-lg">
              <q-chips-input color="primary" :prefix="$t('DETAIL_MODAL.INSTEAD_PRE')" class="col-5" inverted readonly v-model="MEMBER.show_pre" disable/>
              <q-icon size="33px" name="keyboard arrow right" />
              <q-chips-input color="primary" :prefix="$t('DETAIL_MODAL.INSTEAD_POST')" class="col-5" inverted readonly v-model="MEMBER.show_post" disable/>
            </div> -->
          </div>
        </q-card-main>

        <q-card-main key="agreement">
          <div>
            <q-chips-input color="primary" :prefix="$t('DETAIL_MODAL.MEMBER_CHIPS_PRE')" class="col-9" inverted readonly v-model="MEMBER.show_pre" disable/>
          </div>
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
  QCheckbox,
  QChipsInput,
  QIcon,
  QBtn
} from 'quasar'

export default {
  name: 'LaunchProposalModal',
  props: ['show', 'detail', 'type'],
  data() {
    return {
      p_title: null,
      p_time_start: null,
      p_time_end: null,
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
        brief: null,
        title: null
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
        type_selected: [],
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
    QCheckbox,
    QChipsInput,
    QIcon,
    QBtn
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