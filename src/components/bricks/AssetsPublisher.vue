<template>
  <q-card class="row col shadow-1">
    <q-card-title>
      {{hasIssuer?$t('PUBLISHER_ALREADY_REGISTERED'):$t('REGISTERED_PUBLISHER')}}
      <div slot="subtitle"> </div>
    </q-card-title>
    <q-card-main class="row col-12 justify-center ">
      <q-field class="col-8" :label="$t('DAPP_NAME')" :label-width="2" :error="$v.issuer.name.$error" error-label="error" :count="15">
        <q-input @change="$v.issuer.name.$touch" v-model="issuer.name" clearable :disable="hasIssuer" />
      </q-field>
      <q-field class="col-8" :label="$t('DESCRIBE')" :label-width="2" :error="$v.issuer.desc.$error" :row="5" :count="500" error-label="error">
        <q-input @change="$v.issuer.desc.$touch" type="textarea" v-model="issuer.desc" clearable  :disable="hasIssuer"/>
      </q-field>
      <q-field v-show="hasIssuer || secondPublicKey" class="col-8" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :error="secondPwdError" :label-width="2"  :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
        <q-input type="password" v-model="secondPwd"  />
      </q-field>
    </q-card-main>
    <q-card-separator />
    <q-card-main v-if="!hasIssuer" class="row col-12 justify-center ">
      <div class="row col-10 justify-end">
        <q-btn loader big class="col-auto " color="primary" @click="submit">
          {{$t('SUBMIT')}}
        </q-btn>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import { QField, QInput, QCard, QIcon, QCardTitle, QCardSeparator, QCardMain, QBtn } from 'quasar'
import { api } from '../../utils/api'
import { required, maxLength } from 'vuelidate/lib/validators'
import { confirm, toastError } from '../../utils/util'
import { createIssuer } from '../../utils/asch'
import { secondPwdReg } from '../../utils/validators'

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
    QBtn
  },
  data() {
    return {
      hasIssuer: false,
      issuer: {
        name: '',
        desc: ''
      },
      secondPwd: '',
      secondPwdError: false
    }
  },
  validations: {
    issuer: {
      name: {
        required,
        maxLength: maxLength(15)
      },
      desc: {
        required,
        maxLength: maxLength(500)
      }
    }
  },
  methods: {
    async getIssuer() {
      let res = await api.issuer({
        address: this.user.account.address
      })
      if (res.success) {
        this.hasIssuer = true
        this.issuer = res.issuer
        // TODO
      }
    },
    submit(e, done) {
      const t = this.$t
      this.$v.issuer.$touch()
      const secondPwd = this.secondPwd
      const isValid = this.$v.issuer.$error
      const pwdValid = !secondPwdReg.test(secondPwd)
      this.secondPwdError = pwdValid
      if (isValid || pwdValid) {
        toastError(t('ERR_PUBLISHER_NOT_EMPTY'))
        done()
      } else {
        this.secondPwdError = false
        const { secret, account } = this.user
        const { name, desc } = this.issuer
        console.log(secret)
        confirm(
          { title: t('CONFIRM'), message: t('OPERATION_REQUIRES_FEE') + '100 XAS' },
          () => {
            done()
          },
          async () => {
            let trans = createIssuer(name, desc, secret, account.secondPublicKey)
            let res = await api.broadcastTransaction(trans)
            console.log(res)
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
    }
  },
  mounted() {
    if (this.user) {
      this.getIssuer()
    }
  },
  watch: {
    userObj(val) {
      if (val) {
        this.getIssuer()
      }
    }
  }
}
</script>

<style>

</style>
