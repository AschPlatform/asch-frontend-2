<template>
  <q-layout>
    <q-page-container class="login-container">
      
      <div class="login-center row justify-center">
        <div class="mobile-only row justify-center items-center mobile-logo bg-primary">
         <span class="mobile-icon"></span>
        </div>  
        <div class="desktop-only main-logo" />
        <q-page padding :class="loginContentClass">
          <div :class="mainPageClass">
            <img class="desktop-only login-ball" ref="img" :src="loginBallImg" alt="login ball">
            <q-card v-if="registerStep==0" :class="loginPanelClass">
              <q-card-title >
                <div class="row justify-between"> 
                  <span class="col-md-3 col-xs-6 lite-orange card-font">
                    {{$t('LOGIN')}}
                  </span>
                  <div class="col-md-3 col-xs-6">
                    <q-select  chips color="secondary" v-model="lang" :options="langsOpts" />
                  </div>
                </div>
                
              </q-card-title>
              <q-card-main class="row col-10 justify-center ">
                <q-field class="col-10" :error="$v.secret.$error" :error-label="$t('ERR_VIOLATE_BIP39')">
                  <q-input icon="search" :float-label="$t('INPUT_PASSWORD')" @change="$v.secret.$touch" type="password" v-model="secret" @keyup.enter="userLogin" clearable />
                </q-field>
                <div class="row col-10 justify-between options-panel">
                  <q-select style="width:125px" separator radio :float-label="$t('CHOSE_SERVER')"  class="col" v-model="serverUrl" :options="serverOpts" />
                </div>
                <div class="row col-10 q-mt-lg">
                  <p></p>
                </div>
              </q-card-main>
              <q-card-main class="row col-10 justify-center ">
                <div class="row col-10 justify-between">
                  <q-btn :loading="loading" big class="col-5" @click="userLogin" color="primary">
                    {{$t('LOGIN')}}
                  </q-btn>
                  <q-btn big  class="col-5" @click="newUser" color="primary">
                    {{$t('NEW_ACCOUNT')}}
                  </q-btn>
                </div>
              </q-card-main>
            </q-card>
            <q-card  v-show="registerStep==1" :class="registerPanelClass">
              <q-card-title class="lite-orange card-font">
                <span class="lite-orange card-font">
                {{$t('CREATE_MASTER_PASSWORD')}}
                </span>  
              </q-card-title> 
              <q-card-main class="row col-12 justify-center ">
                <q-field  class="col-10" :helper="$t('CREATE_TIP1')">
                  <q-input type="textarea" class="new-secret-input col-6" v-model="newSecret" disable :min-rows="3" />
                  <q-btn class="copy-new-secret col-10" color="primary" v-clipboard="newSecret || 'no data' "  flat round icon="content copy" @click="jumpOut($t('COPY_SUCCESS'))" />
                </q-field>
                <q-field  class="col-10">
                  <q-input type="textarea" class="margin-t-10" :float-label="$t('CREATE_TIP2')" v-model="confirmNewSecret" clearable />
                </q-field>
              </q-card-main>
              <q-card-main class="prompt-message">
                <q-checkbox v-model="selection" val="one" :label="$t('READ_TIP1')" />
                <br><br>
                <q-checkbox class="selection-container-two" v-model="selection" val="two" :label="$t('READ_TIP2')" />
                <br><br>
                <q-checkbox class="selection-container-three" v-model="selection" val="three" :label="$t('READ_TIP3')" />
              </q-card-main>
              <q-card-main class="row col-10 justify-center padding-b-54">
                <div v-show="registerStep==1" class="row col-10 justify-between">
                  <q-btn big class="col-auto col-5" color="primary" @click="toLogin">
                    {{$t('CANCEL_LOGIN')}}
                  </q-btn>
                  <q-btn big class="col-auto col-5" color="primary" @click="verifyNewSecret">
                    {{$t('CREATE_MASTER_PASSWORD')}}
                  </q-btn>
                </div>
              </q-card-main>
            </q-card>
          </div>
        </q-page>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  QPageContainer,
  QPage,
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
import loginBallImg from '../assets/loginBall.png'
import { required } from 'vuelidate/lib/validators'
import { bip39 } from '../utils/validators'
import { langsOpts, officialPeers } from '../utils/constants'
import { getPub, getAddr, generateM } from '../utils/asch'
import { toastError, toast, setCache, removeCache, getCache } from '../utils/util'
import { mapActions, mapMutations } from 'vuex'

export default {
  components: {
    QPageContainer,
    QPage,
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
      loginBallImg,
      secret: '',
      remember: true,
      lang: '',
      langsOpts: langsOpts,
      isRegister: false,
      registerStep: 0,
      newSecret: '',
      confirmNewSecret: '',
      loading: false,
      secretSaved: false,
      serverUrl: ' ',
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
          if (!user.account) {
            user.account = {
              address,
              xas: 0,
              isLocked: 0,
              isAgent: 0,
              lockHeight: 0,
              agent: 0,
              weight: 0,
              agentWeight: 0
            }
          }
          this.remember ? setCache('user', user) : removeCache('user')
          this.updateUserInfo(user)
          this.loading = false
          this.setUserIsLogin(true)
          this.$router.push('home')
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
    toLogin() {
      this.registerStep = 0
    },
    newUser() {
      this.newSecret = generateM()
      this.registerStep = 1
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
    let clentLang = navigator.language ? navigator.language.split('-')[0].toLowerCase() : ''
    let cacheLang = getCache('locale')

    this.lang = cacheLang ? cacheLang : clentLang !== 'zh' ? 'en' : 'zh'
    import(`src/i18n/${this.lang}`).then(lang => {
      this.$q.i18n.set(lang.default)
    })
    if (window && window.location && process.env.NODE_ENV === 'production') {
      const location = window.location
      let server = location.protocol + '//' + location.hostname + ':' + location.port || 80
      setCache('currentServer', server)
    }
  },
  created() {
    removeCache('currentServer')
  },
  computed: {
    loginPanelClass() {
      return this.isDesk ? 'login-panel' : 'login-panel width-100'
    },
    registerPanelClass() {
      return this.isDesk ? 'register-panel' : 'register-panel width-100'
    },
    loginContentClass() {
      return this.isDesk ? 'row justify-center' : 'row justify-center width-100'
    },
    mainPageClass() {
      return this.isDesk
        ? 'layout-padding row justify-center main-page'
        : ' row justify-center main-page-mobile'
    },
    serverOpts() {
      let opts = officialPeers.map(server => {
        let opt = {
          label: server.local,
          value: server
          // stamp: server.local
        }

        return opt
      })
      opts.unshift({ label: this.$t('DEFAULT_SERVER'), value: ' ' })
      return opts
    }
  },
  watch: {
    lang(lang) {
      this.locale = this.$i18n.locale = lang
      setCache('locale', lang)
      import(`src/i18n/${lang}`).then(lang => {
        this.$q.i18n.set(lang.default)
      })
    },
    serverUrl(server) {
      if (server) {
        const { ip, port = null } = server
        const serverUrl = port ? ip + ':' + port : ip
        setCache('currentServer', serverUrl)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.layout-padding {
  padding: 0 !important;
}

html, body {
  position: relative;
}

.login-center {
  position: fixed;
  width: 100%;
  height: 300px;
  // position: absolute;
  top: calc(50% - 150px);
  background: #ff5000;

  .mobile-logo {
    position: relative;
    width: 100%;
    height: 58px;
    top: -140px;
    text-align: center;

    .mobile-icon {
      display: block;
      width: 175px;
      height: 38px;
      background: url('../assets/loginWhite.png') no-repeat center center;
      background-size: cover;
    }
  }
}

.main-page {
  position: relative;
  z-index: 10;
  margin-top: -32px;
}

.login-panel {
  width: 513px;
  height: 412px;
  position: relative;
  background: #ffffff;
  padding: 30px 0 40px 0;
  margin-top: -40px;
}

.login-ball {
  position: absolute;
  top: -71px;
  width: 100%;
  max-width: 548px;
}

.main-logo {
  background: url('../assets/loginWhite.png') no-repeat;
  background-size: 100%;
  width: 350px;
  height: 78px;
  margin: 0 auto;
  margin-top: 120px;
}

.options-panel {
  margin-top: 10px;
}

.login-panel .q-card-title {
  font-size: 30px !important;
}

.login-password {
  width: 100%;
  height: 38px;
  border: 1px solid #ebebeb;
  outline: none;
  -webkit-appearance: none;
  border-radius: 0;
}

.register-panel {
  width: 513px;
  position: relative;
  background: #ffffff;
  margin-top: -40px;
}

.prompt-message {
  color: #999999;
  font-size: 12px !important;
}

.new-secret-input {
  display: inline-block;
  width: 80%;
}

.copy-new-secret {
  display: inline-block;
  vertical-align: top;
}

.selection-container-two {
  margin-top: -20px !important;
}

.selection-container-three {
  margin-top: -30px !important;
}

.main-page-mobile {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 364px;
  padding: 0 10px !important;
  margin-top: -32px;
}
</style>
