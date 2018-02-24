<template>
  <q-layout>
    <div class="main-page layout-padding row justify-center ">
      <div class="main-logo  self-center" />
      <q-card v-if="!isRegister" class="login-panel col-lg-9 col-xs-10 ">
        <q-card-title>
          {{$t('LOGIN')}}
        </q-card-title>
        <q-card-main class="row col-10 justify-center ">
          <q-field class="col-10" :helper="$t('INPUT_PASSWORD')" :error="$v.secret.$error" :error-label="$t('ERR_VIOLATE_BIP39')">
            <q-input @change="$v.secret.$touch" type="password" v-model="secret" @keyup.enter="login" clearable />
          </q-field>
          <div class="row col-10 justify-between">
            <q-select class="col-auto " chips color="secondary" v-model="lang" :options="langsOpts" />
            <q-checkbox class="col-auto " v-model="remember">{{$t('KEEP_SESSION')}}</q-checkbox>
          </div>
        </q-card-main>
        <q-card-separator />
        <q-card-main class="row col-10 justify-center ">
          <div class="row col-10 justify-between">
            <q-btn big outline class="col-aotu " color="primary" @click="newUser">
              {{$t('NEW_ACCOUNT')}}
            </q-btn>
            <q-btn :loading="loading" big class="col-auto " color="primary" @click="login">
              {{$t('LOGIN')}}
            </q-btn>
          </div>
        </q-card-main>
      </q-card>
      <q-card v-else class="register-panel col-lg-9 col-xs-10 ">
        <q-card-title>
          {{$t('STEP') + `${registerStep}/2`}}{{registerStep==1?$t('CREATE_MASTER_PASSWORD'):$t('CONFIRM_PASSWORD')}}
          <span slot="subtitle">{{registerStep===1?$t('NEW_PASSWORD'):$t('INPUT_PASSWORD_AGAIN')}}</span>
        </q-card-title>
        <q-card-main v-if="registerStep==1" class="row col-10 justify-center ">
          <q-field class="col-10" :helper="$t('NEW_PWD_TIP_1')">
            <q-input type="textarea" v-model="newSecret" disable :min-rows="5" />
          </q-field>
        </q-card-main>
        <q-card-main v-if="registerStep==2" class="row col-10 justify-center ">
          <q-field class="col-10" :helper="$t('NEW_PWD_TIP_2')">
            <q-input type="textarea" v-model="confirmNewSecret" :min-rows="5" clearable />
          </q-field>
        </q-card-main>
        <q-card-separator />
        <q-card-main class="row col-10 justify-center ">
          <div v-if="registerStep==1" class="row col-10 justify-between">
            <q-btn big class="col-auto " color="primary" @click="saveNext">
              {{$t('NEXT_STEP')}}
            </q-btn>
            <q-btn big outline class="col-aotu " color="primary" @click="saveNewSecret">
              {{$t('SAVE_PASSWORD')}}
            </q-btn>
          </div>
          <div v-else class="row col-10 justify-between">
            <q-btn big class="col-auto " color="primary" @click="verifyNewSecret">
              {{$t('CONFIRM')}}
            </q-btn>
            <q-btn big outline class="col-aotu " color="primary" @click="cleanRegister">
              {{$t('CANCEL')}}
            </q-btn>
          </div>
        </q-card-main>
      </q-card>
  
    </div>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QCard,
  QIcon,
  QCardTitle,
  QCardSeparator,
  QCardMain,
  QField,
  QInput,
  QSelect,
  QCheckbox,
  QBtn
} from 'quasar'
import { required } from 'vuelidate/lib/validators'
import { bip39 } from '../utils/validators'
import { langsOpts } from '../utils/constants'
import { getPub, getAddr, generateM } from '../utils/asch'
import { api } from '../utils/api'
import { toastError, setCache, removeCache } from '../utils/util'

export default {
  components: {
    QLayout,
    QCard,
    QIcon,
    QCardSeparator,
    QCardMain,
    QCardTitle,
    QField,
    QInput,
    QSelect,
    QCheckbox,
    QBtn
  },
  data() {
    return {
      secret: '',
      remember: false,
      lang: '',
      langsOpts: langsOpts,
      isRegister: false,
      registerStep: 0,
      newSecret: '',
      confirmNewSecret: '',
      loading: false,
      secretSaved: false
    }
  },
  validations: {
    secret: {
      required,
      bip39: bip39()
    }
  },
  computed: {},
  methods: {
    async login(e, done) {
      this.loading = true
      const t = this.$t
      this.$v.secret.$touch()
      if (this.$v.secret.$error) {
        toastError(t('ERR_VIOLATE_BIP39'))
        this.loading = false
        return
      }
      let publicKey = getPub(this.secret)
      let user = {}
      try {
        let data = await api.login({
          publicKey: publicKey
        })
        if (data.success === true) {
          user = data
          user.secret = this.secret
          user.publicKey = publicKey
          this.remember ? setCache('user', user) : removeCache('user')
          // 是否登录的全局变量
          this.loading = false
          this.$router.push({
            name: 'home',
            params: {
              user: user
            }
          })
        } else {
          toastError(t('ERR_SERVER_ERROR'))
          this.loading = false
        }
      } catch (e) {
        console.log(e)
        toastError(t('ERR_SERVER_ERROR'))
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    newUser() {
      this.newSecret = generateM()
      this.registerStep = 1
      this.isRegister = true
    },
    saveNext() {
      if (this.secretSaved) {
        this.registerStep = 2
      } else {
        toastError(this.$t('NEW_PWD_TIP_2'))
      }
    },
    saveNewSecret() {
      let secret = this.newSecret
      let publicKey = getPub(secret)
      let address = getAddr(publicKey)
      let txt = 'secret:' + '\r\n' + secret + '\r\n\r\n' + 'address:' + '\r\n' + address + '\r\n'
      const link = document.createElement('a')
      link.setAttribute('target', '_blank')
      if (Blob !== undefined) {
        let blob = new Blob([txt], { type: 'text/plain' })
        link.setAttribute('href', URL.createObjectURL(blob))
      } else {
        link.setAttribute('href', 'data:text/plain,' + encodeURIComponent(txt))
      }
      link.setAttribute('download', 'ASCH-secret')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.secretSaved = true
    },
    cleanRegister() {
      this.registerStep = 0
      this.isRegister = false
      this.newSecret = ''
      this.confirmNewSecret = ''
    },
    verifyNewSecret() {
      let valid = this.newSecret === this.confirmNewSecret
      if (valid) {
        this.cleanRegister()
      } else {
        toastError(this.$t('ERR_PASSWORD_NOT_EQUAL'))
      }
    }
  },
  mounted() {
    this.lang = 'zh'
  },
  watch: {
    lang(lang) {
      this.locale = this.$i18n.locale = lang
      import(`src/i18n/${lang}`).then(lang => {
        this.$q.i18n.set(lang.default)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.login-panel {
  height: auto;
  margin-top: 10%;
}

.main-logo {
  background: url('../assets/icon.png') no-repeat;
  width: 300px;
  height: 77px;
  margin: auto;
}
</style>
