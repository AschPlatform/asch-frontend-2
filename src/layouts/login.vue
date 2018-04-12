<template>
  <q-layout>
    <q-page-container>
      <q-page padding class="row justify-center">
        <div class="main-page layout-padding row justify-center ">
          <div class="main-logo" />
          <q-card v-if="!isRegister" class="login-panel col-12 ">
            <q-card-title>
              {{$t('LOGIN')}}
              <div slot="right">
                <!-- <q-select style="width:125px" separator radio float-label="server" class="col" v-model="serverUrl" :options="serverOpts" /> -->
                <q-select class="col-auto " chips color="secondary" v-model="lang" :options="langsOpts" />
              </div>
            </q-card-title>
            <q-card-main class="row col-10 justify-center ">
              <q-field class="col-10" :error="$v.secret.$error" :error-label="$t('ERR_VIOLATE_BIP39')">
                <q-input :float-label="$t('INPUT_PASSWORD')" @change="$v.secret.$touch" type="password" v-model="secret" @keyup.enter="userLogin" clearable />
              </q-field>
              <div class="row col-10 justify-between options-panel">
                <!-- <q-select class="col-auto " chips color="secondary" v-model="lang" :options="langsOpts" /> -->
                <div inline style="line-height: 44px;" class="q-mr-md">{{$t('CHOSE_SERVER')}}:</div>
                <q-select style="width:125px" separator radio float-label="server" class="col" v-model="serverUrl" :options="serverOpts" />
              </div>
              <div class="row col-10 q-mt-lg">
                <q-checkbox class="col-auto " v-model="remember">{{$t('KEEP_SESSION')}}</q-checkbox>
              </div>
            </q-card-main>
            <q-card-separator />
            <q-card-main class="row col-10 justify-center ">
              <div class="row col-10 justify-center">
                <q-btn :loading="loading" big class="col-10" color="primary" @click="userLogin">
                  {{$t('LOGIN')}}
                </q-btn>
              </div>
            </q-card-main>
            <q-card-separator />
            <q-card-main class="row col-10 justify-center ">
              <div class="row col-10 justify-center">
                <q-btn big outline class="col-10" color="primary" @click="newUser">
                  {{$t('NEW_ACCOUNT')}}
                </q-btn>
              </div>
            </q-card-main>
          </q-card>
          <q-card v-else class="register-panel col-lg-9 col-xs-10 ">
            <q-card-title>
              {{$t('CREATE_MASTER_PASSWORD')}}
            </q-card-title>
            <q-card-main v-if="registerStep==1" class="row col-10 justify-center ">
              <q-field :label="$t('NEW_PASSWORD')" class="col-10" label-width="2" :helper="$t('CREATE_TIP1')">
                <q-input type="textarea" class="" v-model="newSecret" disable :min-rows="5" />
                <q-btn color="primary" v-clipboard="newSecret || 'no data' " class="float-right" flat round icon="content copy" @click="jumpOut('Copied')" />
              </q-field>
              <q-field :label="$t('CONFIRM_PASSWORD')" class="col-10" label-width="2" :helper="$t('CREATE_TIP2')">
                <q-input type="textarea" v-model="confirmNewSecret" :min-rows="5" clearable />
              </q-field>
            </q-card-main>
            <q-card-separator />
            <q-card-main>
              <q-checkbox v-model="selection" val="one" :label="$t('READ_TIP1')" />
              <br><br>
              <q-checkbox v-model="selection" val="two" :label="$t('READ_TIP2')" />
              <br><br>
              <q-checkbox v-model="selection" val="three" :label="$t('READ_TIP3')" />
            </q-card-main>
            <q-card-separator />
            <q-card-main class="row col-10 justify-center ">
              <div v-if="registerStep==1" class="row col-10 justify-center">
                <q-btn big class="col-auto " color="primary" @click="verifyNewSecret">
                  {{$t('CREATE')}}
                </q-btn>
              </div>
            </q-card-main>
          </q-card>
        </div>
      </q-page>
  
    </q-page-container>
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
import { langsOpts, officialPeers } from '../utils/constants'
import { getPub, getAddr, generateM } from '../utils/asch'
import { toastError, toast, setCache, removeCache } from '../utils/util'
import { mapActions, mapMutations } from 'vuex'

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
      secretSaved: false,
      serverUrl: '',
      selection: []
    }
  },
  validations: {
    secret: {
      required,
      bip39: bip39()
    }
  },
  methods: {
    ...mapActions(['getAccountsInfo']),
    ...mapMutations(['setUserInfo', 'updateUserInfo', 'setUserIsLogin']),
    async userLogin(e, done) {
      this.loading = true
      const t = this.$t
      this.$v.secret.$touch()
      if (this.$v.secret.$error) {
        toastError(t('ERR_VIOLATE_BIP39'))
        this.loading = false
        return
      }
      let publicKey = getPub(this.secret)
      let address = getAddr(publicKey)
      let user = {}
      try {
        let data = await this.getAccountsInfo({
          address
        })
        if (data.success === true) {
          user = data
          user.secret = this.secret
          user.publicKey = publicKey
          this.remember ? setCache('user', user) : removeCache('user')
          this.updateUserInfo(user)
          this.loading = false
          this.setUserIsLogin(true)
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
    saveNewSecret() {
      let secret = this.newSecret
      let publicKey = getPub(secret)
      let address = getAddr(publicKey)
      let txt = 'secret:' + '\r\n' + secret + '\r\n\r\n' + 'address:' + '\r\n' + address + '\r\n'
      const link = document.createElement('a')
      link.setAttribute('target', '_blank')
      if (Blob !== undefined) {
        let blob = new Blob([txt], {
          type: 'text/plain'
        })
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
      let validKnow = this.selection.length === 3
      if (validKnow) {
        if (valid) {
          this.cleanRegister()
        } else {
          toastError(this.$t('ERR_PASSWORD_NOT_EQUAL'))
        }
      } else {
        toastError(this.$t('ERR_READ_ALL'))
      }
    },
    jumpOut(msg) {
      toast(msg)
    }
  },
  mounted() {
    this.lang = 'zh'
  },
  created() {
    console.log(this.$store)
    removeCache('currentServer')
  },
  computed: {
    serverOpts() {
      return officialPeers.map(server => {
        let opt = {
          label: server.ip,
          value: server,
          stamp: server.local
        }
        return opt
      })
    }
  },
  watch: {
    lang(lang) {
      this.locale = this.$i18n.locale = lang
      import(`src/i18n/${lang}`).then(lang => {
        this.$q.i18n.set(lang.default)
      })
    },
    serverUrl(server) {
      if (server) {
        setCache('currentServer', server)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.main-page {
  margin-top: 0;
}

.login-panel {
  margin-top: 5%;
}

.main-logo {
  background: url('../assets/logo.png') no-repeat;
  background-size: 100%;
  width: 300px;
  height: 77px;
  margin: auto;
}

.options-panel {
  margin-top: 10px;
}
</style>
