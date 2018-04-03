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
        <q-card-separator class="q-my-lg" />
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >

        <q-card-main>
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
        </q-card-main>
        </transition>
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
  QSelect
} from 'quasar'

export default {
  name: 'LaunchProposalModal',
  props: ['show'],
  data() {
    return {
      p_type: null,
      p_title: null,
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
        brief: null
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
    QSelect
  }
}
</script>

<style lang="stylus" scoped>

</style>
