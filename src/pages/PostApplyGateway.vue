<template>
  <q-page class="postContract-container">
    <div class="postContract-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
              <i class="material-icons vertical-align-sub font-20 text-black">border_color</i>
              <h5 class="q-px-md inline-block font-18 q-my-none">{{$t('APPLY_FOR_GATEWAY')}}</h5>
            </span>
      </div>
      <div class="title-line">
        <boundary-line />
      </div>
      <div class=" col-12 inline inner-container">
        <div class="row col-6 padding-l-15">
          <q-field class="block col-5 font-16 custom-postContract-field" label-width="2" :label="$t('BELONG_TO_GATEWAY')" :error-label="$t('ERR_CONTRACT_NAME')">
            <q-input class="border-1" hide-underline v-model="gatewayName" value="" disable />
          </q-field>
        </div>
        <div class="row col-6 padding-l-15">
          <q-field class="block col-5 font-16 custom-postContract-field" label-width="2" :label="$t('ACCOUNT_NICKNAME')" :error-label="$t('ERR_CONTRACT_NAME')">
            <q-input class="border-1" hide-underline v-model="userNickname" value="" disable />
          </q-field>
        </div>
        <div class="row col-6 padding-l-15">
          <q-field class="block col-5 font-16 custom-postContract-field" label-width="2" :label="$t('ACCOUNT_ADDRESS')" :error-label="$t('ERR_CONTRACT_NAME')">
            <q-input class="border-1" hide-underline v-model="address" value="" disable />
          </q-field>
        </div>
  
        <div class="row col-12 padding-l-15">
          <q-field class="block col-5 font-16 custom-postContract-field" label-width="2" :label="$t('GATEWAY_PUBLIC_KEY')" :error-label="$t('ERR_CONTRACT_GAS')">
            <q-input class="border-1" hide-underline value="" :placeholder="$t('INPUT_GATEWAY_PUBLIC_KEY')" />
          </q-field>
          <a class="row col-5 justify-start items-center text-secondary font-16 margin-left-20 padding-bottom-10 cursor-pointer" href="https://www.asch.io/docs" target="_blank">
            <i class="material-icons font-16 text-secondary margin-right-10">help</i> {{$t('GET_GATEWAY_PUBLIC_KEY')}}
          </a>
        </div>
        <div class="row col-12 padding-l-15">
          <q-field class="block col-10 font-16 custom-postContract-field" label-width="1" :label="$t('PERSONAL_INTRODUCE')" :error-label="$t('ERR_CONTRACT_DESC')">
            <q-input class="border-1 textareaInner" type="textarea" hide-underline value="" :placeholder="$t('INPUT_PERSONAL_INTRODUCE')" :max-height="400" :rows="5" />
          </q-field>
        </div>
        <div v-if="secondSignature" class="row col-12 padding-l-15">
          <q-field class="block col-5 font-16 custom-postContract-field" label-width="2" :label="$t('TRS_TYPE_SECOND_PASSWORD')+' : '" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
            <q-input class="border-1" hide-underline v-model="secondPwd" type="password" value="" @blur="$v.secondPwd.$touch" :error="$v.secondPwd.$error" />
          </q-field>
        </div>
        <div class="col-12 padding-l-15">
          <p class="font-16 text-four font-bold">{{$t('MATTERS_NEED_ATTENTION')}}</p>
          <p class="text-three font-16 line-height-30" v-html="$t('MATTERS_NEED_ATTENTION_INFO')"></p>
          <q-checkbox color="orange" v-model="agreeOptions" val="one" readonly>
            <a class="agreeBtn text-secondary" @click="userAgreementShow=true">{{$t('READ_ASCH_PROTOCOL')}}</a>
          </q-checkbox>
        </div>
        <div class="row justify-center col-12">
          <q-btn class="col-3 q-mt-md no-shadow font-18 padding-15" color="secondary" :label="$t('APPLY_NOW')" @click="submit" />
        </div>
      </div>
    </div>
    <user-agreement-modal :show="userAgreementShow" @confirm="confirm" @cancel="userAgreementShow=false" :title="$t('ERR_READ_ALL')" :tips="$t('APPLY_FOR_GATEWAY')+$t('COST_FEE',{num:100})" :content="$t('AGREEMENT_ASSET_CONTENT')" />
  </q-page>
</template>

<script>
import { QPage, QField, QInput, QBtn, QCheckbox } from 'quasar'
import {} from 'vuelidate/lib/validators'
import { secondPwd } from '../utils/validators'
// import { toastError, toast, translateErrMsg } from '../utils/util'
import { mapActions, mapGetters } from 'vuex'
import BoundaryLine from '../components/BoundaryLine'
import UserAgreementModal from '../components/UserAgreementModal'

export default {
  name: 'PostApplyGateway',
  props: ['userObj'],
  components: {
    QPage,
    QField,
    QInput,
    QBtn,
    QCheckbox,
    BoundaryLine,
    UserAgreementModal
  },
  data() {
    return {
      gatewayName: '',
      userAgreementShow: false,
      agreeOptions: [],
      secondPwd: ''
    }
  },
  validations: {
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  mounted() {
    this.initForm()
    let gateway = this.$route.params.gateway
    if (gateway) {
      this.gatewayName = gateway
    } else {
      this.$router.push('gateway')
    }
  },
  methods: {
    ...mapActions(['postContract']),
    confirm() {
      this.userAgreementShow = false
      if (this.agreeOptions.indexOf('one') < 0) {
        this.agreeOptions.push('one')
      }
    },
    initForm() {
      // this.$v.content.$touch()
    },
    async submit() {}
    // async submit() {
    //   let { code, name, gas, desc } = this.content
    //   this.$v.content.$touch()
    //   name = name.trim()
    //   if (this.$v.content.$error) {
    //     return null
    //   }
    //   let secondPwdFlag = this.secondSignature && this.$v.secondPwd.$error
    //   if (secondPwdFlag) {
    //     return null
    //   }
    //   if (code.length > 20480) {
    //     toastError(this.$t('CONTRACT_ERR_CODE'))
    //     return null
    //   }
    //   code = Buffer.from(code).toString('hex')
    //   let gasLimit = BigNumber(+gas)
    //     .times(Math.pow(10, 8))
    //     .toString()
    //   let params = {
    //     gasLimit,
    //     code,
    //     name,
    //     desc,
    //     secondSecret: this.secondPwd
    //   }
    //   let res = await this.postContract(params)
    //   if (res.success) {
    //     toast(this.$t('INF_OPERATION_SUCCEEDED'))
    //     this.$router.push('/contract')
    //   } else {
    //     translateErrMsg(this.$t, res.error)
    //   }
    // }
  },
  computed: {
    ...mapGetters(['userInfo']),
    address() {
      if (this.userInfo && this.userInfo.account && this.userInfo.account.address) {
        return this.userInfo && this.userInfo.account ? this.userInfo.account.address : 'nothing'
      }
    },
    userNickname() {
      if (this.user && this.user.account && this.user.account.name) {
        return this.user.account.name
      } else {
        this.$router.push('gateway')
      }
    },
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : ''
    },
    user() {
      return this.userInfo
    }
  },
  watch: {
    userObj(val) {}
  }
}
</script>

<style lang="stylus" scoped>
.postContract-container {
  padding: 20px;

  .postContract-content {
    background: #ffffff !important;
    padding-bottom: 20px;
    border-radius: 6px;

    .title-line {
      padding: 12px 16px;
    }

    .code-container {
      // padding: 30px 20px;
      border: 1px solid #dddddd;
    }
  }
}

.transfer-title-line {
  display: block;
  width: calc(100% - 40px);
  height: 1px;
  background: #dddddd;
  margin-left: 10px;
}

.border-1 {
  border: 1px solid #dddddd;
  padding-left: 10px;
  min-height: 50px;
}

.textareaInner {
  padding-top: 15px;
}

.inner-container {
  padding: 16px;
}

.codeShow {
  display: block;
}
</style>
