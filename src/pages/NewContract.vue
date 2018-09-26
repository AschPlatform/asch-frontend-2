<template>
<q-page class="contract-container ">
  <q-card class="row col-12 padding-20 margin-top-20" color="white" text-color="black">
      <q-card-title class="col-12 font-22 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('NEW_CONTRACT')}}
        <q-btn color="secondary" slot="right" class="row items-center" @click="$router.push('/contract')">
          <q-icon name="reply" />
        </q-btn>
      </q-card-title>
      <q-card-separator class="col-12 q-my-lg bg-999 no-border-top" />
      <div class="row col-md-12">
        <q-field :error-label="$t('CONTRACT_ERR_NAME')" :label-width="2" :label="$t('CONTRACT_NAME')" class="col-md-8 col-xs-12 font-16 text-four">
          <q-input v-model="name" @focus="$v.contract.name.$reset()" @blur="$v.contract.name.$touch()" :error="$v.contract.name.$error" />
        </q-field>
      </div>
      <div class="row col-md-12">
        <q-field :error-label="$t('CONTRACT_ERR_DESC')" :label-width="2" :label="$t('DESCRIBE')" class="col-md-8 col-xs-12 font-16 text-four">
          <q-input v-model="desc" type="textarea" @focus="$v.contract.desc.$reset()" @blur="$v.contract.desc.$touch()" :error="$v.contract.desc.$error" />
        </q-field>
      </div>
      <div class="row col-md-12">
        <q-field :error-label="$t('CONTRACT_ERR_CODE')" :label-width="2" :label="$t('CONTRACT_CODE')" class="col-md-8 col-xs-12 font-16 text-four">
          <q-input v-model="code" type="textarea" @focus="$v.contract.code.$reset()" @blur="$v.contract.code.$touch()" :error="$v.contract.code.$error" />
        </q-field>
      </div>
      <div class="row col-md-12">
        <q-field :error-label="$t('CONTRACT_ERR_GAS')" :label-width="2" :label="$t('CONTRACT_GAS')" class="col-md-8 col-xs-12 font-16 text-four">
          <q-input v-model="gas" @focus="$v.contract.gas.$reset()" @blur="$v.contract.gas.$touch()" :error="$v.contract.gas.$error" />
        </q-field>
      </div>
    </q-card>
</q-page>
</template>
<script>
import {
  QPage,
  QInput,
  QField,
  QCard,
  QCardMain,
  QCardTitle,
  QCardSeparator,
  QBtn,
  QIcon
} from 'quasar'
// import { mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'NewContract',
  components: {
    QPage,
    QInput,
    QField,
    QCard,
    QCardMain,
    QCardTitle,
    QCardSeparator,
    QBtn,
    QIcon
  },
  data() {
    return {
      name: '',
      desc: '',
      code: '',
      gas: 0
    }
  },
  validations: {
    contract: {
      name: {
        required
      },
      desc: {},
      code: {},
      gas: {}
    }
  },
  methods: {},
  computed: {}
}
</script>
<style lang="stylus" scoped>
</style>