<template>
  <q-modal v-model="show" maximized>
      <q-card class="layout-padding q-mx-xl q-my-xl">
        <q-card-title>{{$t('proposal.LAUNCH')}}</q-card-title>
        <div class="row ">
          <q-field :label-width="2" :label="$t('proposal.SELECT_P_TITLE')" class="col-8">
            <q-input v-model="p_title" />
          </q-field>
        </div>
        <div class="row">
          <q-field :label-width="3"  :label="$t('proposal.SELECT_P_TYPE')" class="col-4">
            <q-select v-model="p_type" :options="proposalType"/>
          </q-field>
          <q-field class="col-4 q-ml-lg">
            <q-select v-model="p_type" :options="councilList" :placeholder="$t('proposal.SELECT_P_COUNCIL')"/>
          </q-field>
        </div>
        <div class="row">
          <q-field :label-width="4"  :label="$t('proposal.SELECT_P_PERIOD')" class="col-3">
            <q-datetime min="2018-04-05" v-model="p_time_start"/>
          </q-field>
          <span class="self-center col-1">至</span>
          <q-field class="col-3 q-ml-xl">
            <q-datetime v-model="p_time_end"/>
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
              <q-field class="block col-5" label-width="4" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL')">
                <q-select v-model="councilList" :options="councilList"></q-select>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9" label-width="2" :label="$t('LAUNCH_MODAL.REMOVE_REASON')">
                <q-input type="textarea" v-model="NEW.brief" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
        </q-card-main>

        <q-card-main v-show="this.p_type !== null" key="agreement">
          <q-checkbox v-model="NEW.agreement" val="one" :label="$t('READ_TIP1')" />
          <br><br>
          <q-checkbox v-model="NEW.agreement" val="two" :label="$t('READ_TIP2')" />
          <br><br>
          <q-checkbox v-model="NEW.agreement" val="three" :label="$t('READ_TIP3')" />
          <div class="row justify-center">
            <q-btn color="primary" size="md" :label="$t('proposal.BTN_LAUNCH')"></q-btn>
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
  QDatetime
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
    QDatetime
  }
}
</script>

<style lang="stylus" scoped>

</style>
