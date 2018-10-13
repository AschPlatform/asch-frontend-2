<template>
  <q-page class="postContract-container">
    <div class="postContract-content">
      <div class="no-wrap q-pa-md row justify-between">
        <span>
          <i class="material-icons vertical-align-sub font-20 text-black">border_color</i>
          <h5 class="q-px-md inline-block font-18 q-my-none">{{$t('SMART_CONTRACT_POST')}}</h5>
        </span>
      </div>
      <div class="title-line">
        <boundary-line />
      </div>
      <div class="row col-12 inner-container">
        <div class="row col-6 padding-l-15">
          <q-field class="block col-10 font-16 custom-postContract-field" label-width="2" :label="$t('SMART_CONTRACT_NAME')+' : '" :error-label="$t('ERR_CONTRACT_NAME')">
            <q-input class="border-1" hide-underline v-model="content.name" value="" :placeholder="$t('PLACEHOLDER_CONTRACT_NAME')" :error="$v.content.name.$error" />
          </q-field>
        </div>
        <div class="row col-12 padding-l-15">
          <q-field class="block col-10 font-16 custom-postContract-field" label-width="1" :label="$t('SMART_CONTRACT_CODE')+' : '" :error-label="$t('ERR_CONTRACT_CODE')">
            <div class="code-container">
              <codemirror :value.sync="content.code" :options="getCodeOption"   @change="change" />
            </div>
            <p v-if="$v.content.code.maxLength" class="margin-top-10 margin-b-0 text-negative">{{$t('CONTRACT_ERR_CODE')}}</p>
          </q-field>
        </div>
        <div class="row col-12 padding-l-15">
          <q-field class="block col-10 font-16 custom-postContract-field" label-width="1" :label="$t('SMART_CONTRACT_DESC')+' : '" :error-label="$t('ERR_CONTRACT_DESC')">
            <q-input class="border-1 textareaInner" type="textarea" hide-underline v-model="content.desc" value="" :placeholder="$t('PLACEHOLDER_SMART_CONTRACT_DESC')" :max-height="200" :rows="1" :error="$v.content.desc.$error" />
          </q-field>
        </div>
        <div class="row col-12 padding-l-15">
          <q-field class="block col-5 font-16 custom-postContract-field" label-width="2" :label="'Gas_Limit : '" :error-label="$t('ERR_CONTRACT_GAS')">
            <q-input class="border-1" hide-underline v-model="content.gas" value="" :placeholder="$t('PLACEHOLDER_CONTRACT_GAS')" :error="$v.content.gas.$error" />
          </q-field>
          <div class="row justify-center items-center text-secondary font-16 margin-left-20 padding-bottom-10">{{$t('EXPEND_GAS_LIMIT')}}</div>
        </div>
        <div v-if="secondSignature" class="row col-12 padding-l-15">
          <q-field class="block col-5 font-16 custom-postContract-field" label-width="2" :label="$t('TRS_TYPE_SECOND_PASSWORD')+' : '" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"> 
            <q-input class="border-1" hide-underline v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error="$v.secondPwd.$error" />
          </q-field>
        </div>
        <div class="row justify-center col-12">
           <q-btn class="col-3 q-mt-md no-shadow font-18 padding-15" :disable="$v.content.$error || $v.secondPwd.$error" color="secondary" :label="$t('SMART_CONTRACT_COMMIT')" @click="submit" />
        </div>
       
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
import BoundaryLine from '../components/BoundaryLine'

export default {
  name: 'PostContract',
  components: {
    QPage,
    QField,
    QInput,
    QBtn,
    codemirror,
    BoundaryLine
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
      code: {
        required,
        maxLength: maxLength(20480)
      },
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
      code = Buffer.from(code).toString('hex')
      console.log(Buffer.from(code, 'hex').toString('utf-8'))
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
    },
    change(val) {
      this.content.code = val
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

    .title-line {
      padding: 12px 16px;
    }

    .code-container {
      padding: 30px 20px;
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
