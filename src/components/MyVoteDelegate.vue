<template>
  <q-card class="q-px-sm">
    <q-card-title>
    {{!isGonnaSet ? this.$t('VOTE_DELEGATE') : this.$t('VOTE_SET')}}
    </q-card-title>
    <q-card-separator />
    <q-card-main class="row" v-if="isGonnaSet">
      <q-input class="col-12" clearable v-model="agent" :float-label="$t('VOTE_DELEGATE_TIP')"></q-input>
      <q-input class="col-12" v-if="secondSignature" v-model="secondPwd" type="password" :float-label="$t('TRS_TYPE_SECOND_PASSWORD')"></q-input>
      <q-btn v-if="!isGonnaSet" color="secondary" :disable="btnDisable" @click="action">{{$t(btnInfo)}}</q-btn>
     <div class="col-12 justify-between">
       <br />
        <q-btn color="secondary" :disable="btnDisable" @click="setAgent">{{$t('SUBMIT')}}</q-btn>
        <q-btn color="secondary" @click="isGonnaSet=false">{{$t('CANCEL')}}</q-btn>
     </div>
    </q-card-main>
    <q-card-main class="padding-t-b-40" align="center" v-else>
      <div v-if="agentName">
         <span class="font-30 text-black vertical-align-sub margin-left-24">{{agentName}}</span>
        (<a class="text-blue cursor-pointer" @click="$emit('openDetail')">{{$t('AGENT_DETAIL')}}</a>)
        </div>
      <q-btn  class="margin-t-10" color="secondary" :disable="btnDisable" @click="action">{{$t(btnInfo)}}</q-btn>
      <p class="margin-t-10" v-if="isLocked">{{$t('AUTHOR_AMOUNT',{amount:convertFeeAmount()})}}</p>
      <!-- <a class="text-blue" @click="$emit('openDetail')">{{$t('AGENT_DETAIL')}}</a> -->
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QCardSeparator, QBtn, QInput } from 'quasar'
import { toastWarn } from '../utils/util'
import { convertFee } from '../utils/asch'
import { nicknameReg, secondPwdReg } from '../utils/validators'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      isGonnaSet: false,
      agent: '',
      secondPwd: '',
      btnDisable: false
    }
  },
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QBtn,
    QInput
  },
  methods: {
    convertFeeAmount() {
      return convertFee(this.user.account.weight)
    },
    action() {
      if (this.isDelegate) {
        toastWarn(this.$t('DELEGATE_CAN_NOT_BE_AGENT'))
        this.disableBtn('btnDisable')
        return
      }
      if (!this.isLocked) {
        toastWarn(this.$t('PLEASE_LOCK'))
        this.disableBtn('btnDisable')
        return
      }
      // this.isSetAgent ? this.cancelAgent() : this.setAgent()
      if (this.agentName) {
        this.cancelAgent()
      } else {
        this.isGonnaSet = true
      }
    },
    cancelAgent() {
      this.$emit('repealAgent')
    },
    // TODO SET DELEGATE
    setAgent() {
      if (!nicknameReg.test(this.agent)) {
        toastWarn(this.$t('ERR_NICKNAME'))
        this.disableBtn('btnDisable')
        return
      }
      if (this.secondSignature && !secondPwdReg.test(this.secondPwd)) {
        toastWarn(this.$t('ERR_SECOND_PASSWORD_FORMAT'))
        return
      }
      this.$emit('setAgent', { agent: this.agent, secondPwd: this.secondPwd }, () => {
        this.isGonnaSet = false
      })
    },
    disableBtn(model) {
      this[model] = true
      this._.delay(() => {
        this[model] = false
      }, 3000)
    }
  },
  mounted() {},
  computed: {
    ...mapGetters(['userInfo']),
    user() {
      return this.userInfo
    },
    btnInfo() {
      if (this.agentName) {
        return 'VOTE_CANCEL'
      } else {
        return 'VOTE_SET'
      }
    },
    isSetAgent() {
      return this.user && this.user.account ? this.user.account.isAgent === 1 : false
    },
    agentName() {
      return this.user && this.user.account ? this.user.account.agent : ''
    },
    isLocked() {
      return this.user && this.user.account ? this.user.account.isLocked === 1 : false
    },
    isDelegate() {
      return this.user && this.user.account ? this.user.account.isDelegate === 1 : false
    },
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : null
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
