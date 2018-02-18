<template>
  <q-card class="row col shadow-1">
    <q-card-title>
      {{hasIssuer?$t('PUBLISHER_ALREADY_REGISTERED'):$t('REGISTERED_PUBLISHER')}}
      <div slot="subtitle"> </div>
    </q-card-title>
    <q-card-main class="row col-12 justify-center ">
      <q-field class="col-8" :label="$t('DAPP_NAME')" :label-width="1" :error="$v.issuer.name.$error" error-label="error" :count="15">
        <q-input @change="$v.issuer.name.$touch" v-model="issuer.name" clearable :disable="hasIssuer" />
      </q-field>
      <q-field class="col-8" :label="$t('DESCRIBE')" :label-width="1" :error="$v.issuer.desc.$error" :row="5" :count="500" error-label="error">
        <q-input @change="$v.issuer.desc.$touch" type="textarea" v-model="issuer.desc" clearable  :disable="hasIssuer"/>
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
      }
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
      this.$v.issuer.$touch()
      let isValid = this.$v.issuer.$error
      if (isValid) toastError('ERR_PUBLISHER_NOT_EMPTY')
      const t = this.$t
      const { secret } = this.user
      const { name, desc } = this.issuer

      confirm(
        { title: t('CONFIRM'), message: t('OPERATION_REQUIRES_FEE') },
        () => {
          done()
        },
        async () => {
          createIssuer(name, desc)
        }
      )
    }
  },
  computed: {
    user() {
      return this.userObj
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
