<template>
  <q-card class="row col shadow-1">
    <q-card-title>
      {{user.issuer?$t('PUBLISHER_ALREADY_REGISTERED'):$t('REGISTERED_PUBLISHER')}}
      <div slot="subtitle"> </div>
    </q-card-title>
    <q-card-main class="row col-12 justify-center ">
      <q-field class="col-8" :label="$t('ASSET_NAME')" :label-width="3" :error="$v.assets.name.$error" error-label="error" :count="15">
        <q-input @change="$v.assets.name.$touch" v-model="assets.name" clearable  />
      </q-field>
      <q-field class="col-8" :label="$t('DESCRIBE')" :label-width="3" :error="$v.assets.desc.$error" :row="6" :count="500" error-label="error">
        <q-input @change="$v.assets.desc.$touch" type="textarea" v-model="assets.desc" clearable  />
      </q-field>
      <q-field class="col-8" :label="$t('TOPLIMIT')" :label-width="3" :error="$v.assets.maximum.$error"  :error-label="$t('ERR_ASSET_TOPLIMIT_NOT_CORRECT')">
        <q-input v-model="assets.maximum"  />
      </q-field>
      <q-field class="col-8" :label="$t('PRECISION')" :helper="$t('ERR_ASSET_PRECISION_MUST_BE_INTEGER_BETWEEN_0_16')" :error="$v.assets.precision.$error" :label-width="3"  :error-label="$t('ERR_ASSET_PRECISION_NOT_CORRECT')">
        <q-input v-model="assets.precision" :count="16" />
      </q-field>
      <q-field class="col-8" :label="$t('STRATEGY')" :helper="$t('STRATEGY_WARNING')"  :label-width="3" >
        <q-input v-model="assets.strategy"  type="textarea"  :row="6" />
      </q-field>
      <q-field class="col-8" :label="$t('ALLOW_WRITEOFF')"  :label-width="3" >
        <q-radio v-model="assets.allowWriteoff" :val="0" color="faded" :label="notAllow" />
      <q-radio v-model="assets.allowWriteoff" :val="1" color="positive" :label="allow" style="margin-left: 10px" />
      </q-field>
      <q-field class="col-8" :label="$t('ALLOW_WHITELIST')"  :label-width="3"  >
        <q-radio v-model="assets.allowWhitelist" :val="0" color="faded" :label="notAllow" />
      <q-radio v-model="assets.allowWhitelist" :val="1" color="positive" :label="allow" style="margin-left: 10px" />
      </q-field>
      <q-field class="col-8" :label="$t('ALLOW_BLACKLIST')"  :label-width="3" >
        <q-radio v-model="assets.allowBlacklist" :val="0" color="faded" :label="notAllow" />
      <q-radio v-model="assets.allowBlacklist" :val="1" color="positive" :label="allow" style="margin-left: 10px" />
      </q-field>
    </q-card-main>
    <q-card-separator />
    <q-card-main class="row col-12 justify-center ">
      <div class="row col-10 justify-end">
        <q-btn loader big class="col-auto " color="primary" @click="submit">
          {{$t('SUBMIT')}}
        </q-btn>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import {
  QField,
  QInput,
  QCard,
  QIcon,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QBtn,
  QRadio
} from 'quasar'
import { api, translateErrMsg } from '../utils/api'
import { required, maxLength } from 'vuelidate/lib/validators'
import { confirm, toastError } from '../utils/util'
import { createIssuer } from '../utils/asch'

export default {
  props: ['userObj'],
  components: {
    QField,
    QInput,
    QCard,
    QIcon,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QBtn,
    QRadio
  },
  data() {
    return {
      assets: {
        name: '',
        desc: '',
        maximum: '',
        precision: '',
        strategy: '',
        writeoff: '',
        allowWriteoff: 0,
        allowWhitelist: 0,
        allowBlacklist: 0
      },
      issuer: {},
      hasIssuer: false
    }
  },
  validations: {
    // TODO figure out why vuelidate can not bind vue 'this' in rule config
    assets: {
      name: {
        required,
        maxLength: maxLength(15)
      },
      desc: {
        required,
        maxLength: maxLength(500)
      },
      maximum: {
        required
      },
      precision: {
        required
      },
      strategy: {},
      writeoff: {
        required
      },
      allowWriteoff: {},
      allowWhitelist: {},
      allowBlacklist: {}
    }
  },
  methods: {
    submit(e, done) {
      const t = this.$t
      if (!this.user.issuer) {
        toastError(t('ERR_NO_PUBLISHER_REGISTERED_YET'))
        done()
        return
      }
      this.$v.assets.$touch()
      const isValid = this.$v.assets.$error
      if (isValid) {
        // toastError(t('ERR_PUBLISHER_NOT_EMPTY'))
        done()
      } else {
        const { secret, account } = this.user
        const { name, desc } = this.assets
        console.log(secret)
        confirm(
          { title: t('CONFIRM'), message: t('OPERATION_REQUIRES_FEE') + '100 XAS' },
          () => {
            done()
          },
          async () => {
            let trans = createIssuer(name, desc, secret, account.secondPublicKey)
            let res = await api.broadcastTransaction(trans)
            if (res.success) {
            } else {
              translateErrMsg(res.error)
            }
          }
        )
      }
    },
    getSecond() {
      return this.secondPublicKey
    }
  },
  computed: {
    user() {
      return this.userObj
    },
    secondPublicKey() {
      return this.user.account.secondPublicKey
    },
    allow() {
      return this.$t('ALLOW')
    },
    notAllow() {
      return this.$t('NOT_ALLOW')
    }
  },
  mounted() {
    this.$root.$emit('getIssuer', issuer => {
      this.issuer = issuer
    })
  },
  watch: {
    userObj(val) {
      this.issuer = val.issuer
    }
  }
}
</script>

<style>

</style>
