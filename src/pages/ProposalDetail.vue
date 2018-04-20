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
            <q-input readonly hide-underline v-model="detail.title"/>
          </q-field>
        </div>
        <div class="row">
          <q-field :label-width="3" :label="$t('proposal.SELECT_P_TYPE')" class="col-4">
            <q-input readonly hide-underline v-model="detail.topic" />
            <span>{{detail.content | jparse('name', false)}}</span>
          </q-field>
          <!-- <q-field class="col-4 q-ml-lg" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type === 'change_n'">
            <q-select v-model="p_selected" :options="netList" @change="val => {console.log(val)}" @blur="$v.p_selected.$touch()" :error="$v.p_selected.isSelected" :placeholder="$t('proposal.SELECT_P_NET')"/>
          </q-field> -->
        </div>
        <div class="row">
          <q-field :label-width="4" class="col-3" :label="$t('proposal.SELECT_P_PERIOD')">
            <!-- <q-datetime min="2018-04-05" v-model="p_time_start" @blur="$v.p_time_start.$touch()" :error="$v.p_time_start.$error"/> -->
            <q-input readonly hide-underline>{{detail.t_timestamp | time}}</q-input>
          </q-field>
          <span class="self-center col-1" align="center">至</span>
          <q-field class="col-3 q-ml-xl">
            <q-input readonly hide-underline>{{detail.t_timestamp | time}}</q-input>
          </q-field>
        </div>
      <q-card-separator class="q-my-lg"/>
      <q-card-main>
        <q-field>

          <!-- below is net new page -->
          <div class="col-12" v-show="this.detail.topic === 'gateway_register'" id="new">
            <div class="row">
              <q-field class="block col-5" label-width="3" :label="$t('LAUNCH_MODAL.NET_NAME')">
                <q-input readonly hide-underline v-model="content.name"/>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.NET_CURRENCY_TIP')" :label="$t('LAUNCH_MODAL.NET_CURRENCY')">
                <q-input readonly hide-underline v-model="content.currency.symbol"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.PRECISION_TIP')" :label="$t('PRECISION')">
                <q-input readonly hide-underline v-model="content.currency.precision"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-5" label-width="3" :error-label="$t('LAUNCH_MODAL.CURRENCY_BRIEF_TIP')" :label="$t('LAUNCH_MODAL.CURRENCY_BRIEF')">
                <q-input readonly hide-underline v-model="content.currency.desc"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-2" label-width="8" :error-label="$t('ERR.ERR_3_15')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input readonly hide-underline v-model="content.minimumMembers"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-2" label-width="8" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD_NET')">
                <q-input readonly hide-underline v-model="content.updateInterval"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-8" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input readonly hide-underline v-model="content.desc"></q-input>
              </q-field>
            </div>
          </div>
        </q-field>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { deCompileContent } from '../utils/util'
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
  QIcon
} from 'quasar'

export default {
  name: 'ProposalDetail',
  props: ['show', 'type'],
  data() {
    return {
      tid: '',
      detail: null,
      content: null
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
    QIcon
  },
  methods: {
    ...mapActions(['getProposal']),
    back() {
      this.$router.back()
    },
    async getProposalInfo() {
      debugger
      let res = await this.getProposal({
        tid: this.$route.params.tid
      })
      this.detail = res.proposal
      this.content = deCompileContent(this.detail.content)
    }
  },
  mounted() {
    this.getProposalInfo()
    console.log(this.$route.params.tid)
  }
}
</script>

<style lang="stylus" scoped>

</style>