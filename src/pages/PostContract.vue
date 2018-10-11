<template>
  <q-page class="postContract-container">
    <div class="postContract-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
                <i class="material-icons vertical-align-sub font-20 text-black">border_color</i>
                <h5 class="q-px-md inline-block font-18 q-my-none">{{$t('SMART_CONTRACT_POST')}}</h5>
              </span>
      </div>
      <span class="transfer-title-line"></span>
      <div class="col-12 inner-container">
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" :label="$t('SMART_CONTRACT_NAME')" :error-label="$t('ERR_GATEWAY_ADD')">
            <q-input class="border-1" hide-underline v-model="content.name" value="" :error="$v.content.name.$error" />
          </q-field>
        </div>
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" :label="$t('SMART_CONTRACT_CODE')" :error-label="$t('ERR_CONTRACT_CODE')">
            <!-- <q-input class="border-1 textareaInner" type="textarea" hide-underline v-model="content.code" value="" :max-height="600" :rows="17" :error="$v.content.code.$error" /> -->
            <codemirror :value.sync="content.code" :options="getCodeOption" />
          </q-field>
        </div>
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" :label="$t('SMART_CONTRACT_DESC')" :error-label="$t('ERR_CONTRACT_DESC')">
            <q-input class="border-1 textareaInner" type="textarea" hide-underline v-model="content.desc" value="" :max-height="200" :rows="3" :error="$v.content.desc.$error" />
          </q-field>
        </div>
        <div class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" :label="$t('GAS_LIMIT')" :error-label="$t('CONTRACT_ERR_GAS')">
            <q-input class="border-1" hide-underline v-model="content.gas" value="" :error="$v.content.gas.$error" />
          </q-field>
        </div>
        <div v-if="secondSignature" class="row col-12">
          <q-field class="block col-10 font-16" label-width="2" :label="$t('TRS_TYPE_SECOND_PASSWORD')" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"> 
            <q-input class="border-1" hide-underline v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error="$v.secondPwd.$error" />
          </q-field>
        </div>
        <q-btn big class="col-6 q-mt-md" :disable="$v.content.$error || $v.secondPwd.$error" color="secondary" :label="$t('SMART_CONTRACT_COMMIT')" @click="submit" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { QPage, QField, QInput, QBtn } from 'quasar'
import { required, maxLength } from 'vuelidate/lib/validators'
import { secondPwd, amountStrReg, contractNameReg } from '../utils/validators'
import { toastError, toast, translateErrMsg } from '../utils/util'
import { mapActions, mapGetters } from 'vuex'
import { codemirror } from 'vue-codemirror-lite'
import { BigNumber } from 'bignumber.js'

export default {
  name: 'PostContract',
  components: {
    QPage,
    QField,
    QInput,
    QBtn,
    codemirror
  },
  data() {
    return {
      content: {
        name: '',
        code: '',
        desc: '',
        gas: ''
      },
      secondPwd: ''
    }
  },
  validations: {
    content: {
      name: {
        required,
        maxLength: maxLength(32),
        nameReg(value) {
          value = value.trim()
          return contractNameReg.test(value)
        }
      },
      desc: {
        maxLength: maxLength(255)
      },
      // code: {
      //   required,
      //   maxLength: maxLength(10240)
      // },
      gas: {
        required,
        gtZero(value) {
          return amountStrReg.test(value)
        }
      }
    },
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    ...mapActions(['postContract']),
    initForm() {
      this.$v.content.$touch()
    },
    async submit() {
      let { code, name, gas, desc } = this.content
      this.$v.content.$touch()
      name = name.trim()
      if (this.$v.content.$error) {
        return null
      }
      let secondPwdFlag = this.secondSignature && this.$v.secondPwd.$error
      if (secondPwdFlag) {
        return null
      }
      if (code.length > 20480) {
        toastError(this.$t('CONTRACT_ERR_CODE'))
        return null
      }
      let gasLimit = BigNumber(+gas)
        .times(Math.pow(10, 8))
        .toString()
      let params = {
        gasLimit,
        code,
        name,
        desc,
        secondSecret: this.secondPwd
      }
      let res = await this.postContract(params)
      if (res.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        this.$route.push('/contracts')
      } else {
        translateErrMsg(this.$t, res.error)
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : ''
    },
    user() {
      return this.userInfo
    },
    getCodeOption() {
      return {
        mode: 'javascript',
        extraKeys: {
          'Ctrl-Space': 'autocomplete'
        },
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: Infinity
      }
    }
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
  border: 1px solid #999;
  padding-left: 10px;
  min-height: 50px;
}

.textareaInner {
  padding-top: 15px;
}

.inner-container {
  padding: 16px;
}
</style>
