<template>
  <q-layout>
    <q-page-container class="login-container">
      <div class="login-center row justify-center">
        <div class="main-logo" />
        <q-page padding class="login-content row justify-center">
          <div class="main-page layout-padding row justify-center ">
            <img class="login-ball" ref="img" :src="loginBallImg" alt="login ball">
            <q-card v-if="registerStep==0" class="login-panel col-12 ">
              <q-card-title class="">
                <span class="lite-orange card-font">
                      {{$t('LOGIN')}}
                    </span>
                <div slot="right">
                  <q-select class="col-auto " chips color="secondary" v-model="lang" :options="langsOpts" />
                </div>
              </q-card-title>
              <q-card-main class="row col-10 justify-center ">
                <q-field class="col-10" :error="$v.secret.$error" :error-label="$t('ERR_VIOLATE_BIP39')">
                  <q-input icon="search" :float-label="$t('INPUT_PASSWORD')" @change="$v.secret.$touch" type="password" v-model="secret" @keyup.enter="userLogin" clearable />
                </q-field>
                <div class="row col-10 justify-between options-panel">
                  <div inline style="line-height: 44px;" class="q-mr-md">{{$t('CHOSE_SERVER')}}:</div>
                  <q-select style="width:125px" separator radio float-label="server" class="col" v-model="serverUrl" :options="serverOpts" />
                </div>
                <div class="row col-10 q-mt-lg">
                  <q-checkbox class="col-auto " v-model="remember">{{$t('KEEP_SESSION')}}</q-checkbox>
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
            <q-card  v-show="registerStep==1" class="register-panel col-lg-9 col-xs-10 ">
              <q-card-title class="lite-orange card-font">
                <span>
                {{$t('CREATE_MASTER_PASSWORD')}}
                </span>  
              </q-card-title> 
              <q-card-main class="row col-10 justify-center ">
                <q-field  class="col-10" :helper="$t('CREATE_TIP1')">
                  <q-input type="textarea" class="new-secret-input col-8" v-model="newSecret" disable :min-rows="5" />
                  <q-btn class="copy-new-secret col-2" color="primary" v-clipboard="newSecret || 'no data' "  flat round icon="content copy" @click="jumpOut($t('COPY_SUCCESS'))" />
                </q-field>
                <q-field  class="col-10">
                  <q-input type="textarea" :placeholder="$t('CREATE_TIP2')" v-model="confirmNewSecret" clearable />
                </q-field>
              </q-card-main>
              <q-card-main class="prompt-message">
                <q-checkbox v-model="selection" val="one" :label="$t('READ_TIP1')" />
                <br><br>
                <q-checkbox class="selection-container" v-model="selection" val="two" :label="$t('READ_TIP2')" />
                <br><br>
                <q-checkbox class="selection-container" v-model="selection" val="three" :label="$t('READ_TIP3')" />
              </q-card-main>
              <q-card-main class="row col-10 justify-center ">
                <div v-show="registerStep==1" class="row col-10 justify-between">
                  <q-btn big class="col-auto " color="primary" @click="verifyNewSecret">
                    {{$t('CREATE_MASTER_PASSWORD')}}
                  </q-btn>
                  <q-btn big class="col-auto " color="primary" @click="toLogin">
                    {{$t('CANCEL_LOGIN')}}
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
import { toastError, toast, setCache, removeCache } from '../utils/util'
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
    this.lang = 'zh'
    import(`src/i18n/zh`).then(lang => {
      this.$q.i18n.set(lang.default)
    })
  },
  created() {
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
.layout-padding {
  padding: 0 !important;
}

html, body {
  position: relative;
}

.login-container {
  // position: relative;
}

.login-center {
  width: 100%;
  height: 300px;
  position: absolute;
  top: calc(50% - 150px);
  background: #ff5000;
}

.login-container {
  // background: #dddddd;
}

.login-content {
}

.main-page {
  position: relative;
  z-index: 10;
  margin-top: -32px;
}

.login-panel {
  position: relative;
  background: #ffffff;
  padding: 30px 0 40px 0;
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
  margin: auto;
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
  waith: 474px;
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
}

.copy-new-secret {
  display: inline-block;
  vertical-align: top;
}

.selection-container {
  margin-top: -20px !important;
}
</style>
