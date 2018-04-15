<template>
  <q-card class="q-px-sm">
    <q-card-title>
    {{!isGonnaSet ? this.$t('VOTE_DELEGATE') : this.$t('VOTE_SET')}}
    </q-card-title>
    <q-card-separator />
    <q-card-main class="row" v-if="isGonnaSet">
      <q-input class="col-12" clearable v-model="agent" :float-label="$t('VOTE_DELEGATE_TIP')"></q-input>
      <q-input class="col-12" v-if="secondSignature" v-model="secondPwd" type="password" :float-label="$t('TRS_TYPE_SECOND_PASSWORD')"></q-input>
      <q-btn v-if="!isGonnaSet" color="primary" @click="action">{{$t(btnInfo)}}</q-btn>
     <div class="col-12 justify-between">
       <br />
        <q-btn color="primary" @click="setAgent">{{$t('SUBMIT')}}</q-btn>
        <q-btn color="primary" @click="isGonnaSet=false">{{$t('CANCEL')}}</q-btn>
     </div>
    </q-card-main>
    <q-card-main align="center" v-else>
      <span v-if="agentName">{{agentName}}<a class="text-blue" @click="$emit('openDetail')">{{$t('AGENT_DETAIL')}}</a></span>
      <q-btn color="primary" @click="action">{{$t(btnInfo)}}</q-btn>
      <p v-if="isLocked">{{$t('AUTHOR_AMOUNT',{amount:user.account.weight})}}</p>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QCardSeparator, QBtn, QInput } from 'quasar'
import { toastWarn } from '../utils/util'
import { nicknameReg, secondPwdReg } from '../utils/validators'
export default {
  data() {
    return {
      isGonnaSet: false,
      agent: '',
      secondPwd: ''
    }
  },
  props: ['user'],
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QBtn,
    QInput
  },
  methods: {
    action() {
      if (!this.isLocked) {
        toastWarn(this.$t('PLEASE_LOCK'))
        return
      }
      // this.isSetAgent ? this.cancelAgent() : this.setAgent()
      this.isGonnaSet = true
    },
    cancelAgent() {
      this.$emit('repealAgent')
    },
    // TODO SET DELEGATE
    setAgent() {
      if (!nicknameReg.test(this.agent)) {
        toastWarn(this.$t('ERR_NICKNAME'))
        return
      }
      if (this.secondSignature && !secondPwdReg.test(this.secondPwd)) {
        toastWarn(this.$t('ERR_SECOND_PASSWORD_FORMAT'))
        return
      }
      this.$emit('setAgent', this.agent, () => {
        this.isGonnaSet = false
      })
    }
  },
  computed: {
    btnInfo() {
      if (this.isSetAgent) {
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
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : null
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
