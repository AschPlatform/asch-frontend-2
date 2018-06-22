<template>
  <q-modal :class="assetIssuerClass" content-class="modal-content-limit" v-model="show"  :no-esc-dismiss="true">
  <q-card v-if="user" class="padding-b-40">
     <div class="padding-20 bg-secondary">
      <span class="text-white font-22">
        {{user.issuer?$t('PUBLISHER_ALREADY_REGISTERED'):$t('TRS_TYPE_UIA_ISSUER')}}
        </span>
      <div slot="subtitle"> </div>
    </div>
    <q-card-main  class="row col-12 justify-center ">
      <q-field class="col-md-8 col-xs-12" :label="$t('DAPP_NAME')" :label-width="2" :error="$v.issuer.name.$error" :error-label="$t('NAME_OF_DISTRIBUTOR')" :count="15">
        <q-input @blur="$v.issuer.name.$touch" v-model="issuer.name" clearable :disable="!!user.issuer" />
      </q-field>
      <q-field class="col-md-8 col-xs-12" :label="$t('DESCRIBE')" :label-width="2" :error="$v.issuer.desc.$error" :row="5" :count="500" :error-label="$t('DESCRIBE_OF_DISTRIBUTOR')">
        <q-input @blur="$v.issuer.desc.$touch" type="textarea" v-model="issuer.desc" clearable  :disable="!!user.issuer"/>
      </q-field>
      <q-field v-if="!user.issuer && secondSignature" class="col-md-8 col-xs-12" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :error="secondPwdError" :label-width="2"  :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
        <q-input @blur="validateSecondPwd" type="password" v-model="secondPwd"  />
      </q-field>
      <div class="row col-10 justify-between margin-t-20">
        <q-btn size="md" :label="$t('label.cancel')" class="col-3" color="secondary" outline @click="close"/>
        <q-btn :loading="loading" class="col-3" color="secondary" @click="submit">
          {{$t('SUBMIT')}}
        </q-btn>
      </div>
    </q-card-main>
  </q-card>
  </q-modal>
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
  QModal
} from 'quasar'
import { required, maxLength } from 'vuelidate/lib/validators'
import { confirm, toast, toastWarn, translateErrMsg } from '../utils/util'
import asch from '../utils/asch-v2'
import { secondPwdReg } from '../utils/validators'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['show', 'issuerInfo'],
  components: {
    QModal,
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
      issuer: {
        name: '',
        desc: ''
      },
      secondPwd: null,
      secondPwdError: false,
      loading: false
    }
  },
  validations: {
    // TODO figure out why vuelidate can not bind vue 'this' in rule config
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
    ...mapActions(['broadcastTransaction']),
    submit(e) {
      this.loading = true
      const t = this.$t
      this.$v.issuer.$touch()
      const isValid = this.$v.issuer.$error
      let pwdValid = false

      if (this.secondSignature) {
        pwdValid = this.pwdValid
        this.secondPwdError = pwdValid
      }

      if (isValid || pwdValid) {
        toastWarn(t('ERR_PUBLISHER_NOT_EMPTY'))
        this.done()
      } else {
        this.secondPwdError = false
        const { secret } = this.user
        const { name, desc } = this.issuer
        confirm(
          {
            title: t('CONFIRM'),
            message: t('OPERATION_REQUIRES_FEE') + '100 XAS',
            cancel: t('CANCEL'),
            confirm: t('CONFIRM')
          },
          () => {
            this.done()
          },
          async () => {
            let trans = asch.registerIssuer(name, desc, secret, this.secondPwd)
            let res = await this.broadcastTransaction(trans)
            if (res.success) {
              this.user.issuer = true
              this.done()
              this.close()
              toast(this.$t('ISSUE_SUCCESS'))
            } else {
              translateErrMsg(this.$t, res.error)
              this.done()
            }
          }
        )
      }
    },
    validateSecondPwd(val) {
      let isValid = this.pwdValid
      this.secondPwdError = isValid
      return isValid
    },
    done() {
      this.loading = false
    },
    close() {
      this.$emit('close')
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    },
    assetIssuerClass() {
      return this.isDesk ? 'minimized' : 'maximized'
    },
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : null
    },
    pwdValid() {
      return !secondPwdReg.test(this.secondPwd)
    }
  },
  mounted() {
    if (this.issuerInfo) this.issuer = this.issuerInfo
  },
  watch: {
    userObj(val) {
      if (val.issuer) {
        this.issuer = val.issuer
      } else {
        this.$root.$emit('getIssuer', issuer => {
          if (issuer) this.issuer = issuer
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
