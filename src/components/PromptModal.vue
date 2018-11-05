<template>
  <q-modal minimized content-class="modal-content-limit" no-backdrop-dismiss v-model="show" content-css="padding: 0px">
    <big class="modal-title">{{$t(title)}}</big>
    <div class="prompt-modal-conent-container">
      <q-field v-if="type==1" class="col-12 margin-top-54" :label="$t('LABEL_GATEWAY_ADD')" :error-label="$t('ERR_GATEWAY_ADD')" orientation="vertical">
        <q-input @blur="$v.addForm.val.$touch" v-model="addForm.val" :error="$v.addForm.val.$error" :placeholder="$t('PLACEHOLDER_GATEWAY_ADD',{amount:getAmount('status','needSupply')})" />
      </q-field>
      <q-field v-if="type==2" class="col-12 margin-top-54" :label="$t('LABEL_GATEWAY_RETURN')" :error-label="$t('ERR_GATEWAY_RETURN')" orientation="vertical">
        <q-input @blur="$v.returnForm.val.$touch" v-model="returnForm.val" :error="$v.returnForm.val.$error" :placeholder="$t('PLACEHOLDER_GATEWAY_RETURN',{amount:getAmount('status','withdrawl')})" />
      </q-field>
      <q-field v-if="type==3" class="col-12 margin-top-54" :label="$t('LABEL_GATEWAY_COM')" :error-label="$t('ERR_GATEWAY_RETURN')" orientation="vertical">
        <q-input :disable="true" v-model="compensationForm.address" :placeholder="getAmount('claim','realClaim') + ' XAS'" />
      </q-field>
      <q-field v-if="secondSignature" :label="$t('TRS_TYPE_SECOND_PASSWORD')" class="col-12 margin-top-54" orientation="vertical">
        <q-input v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
      </q-field>
      <br/>
      <div v-if="type>0" class="tips">
        <div class="tip-title">{{$t('TIP')}}</div>
        <div v-if="type<3">
          <div class="text-three">{{$t(type==1?'RESERVE_ADD_TIP':'RESERVE_RETURN_TIP',{amount:getAmount('status','currentBail'),ratio:getAmount('status','ratio'),val:getAmount('status',type===1?'needSupply':'withdrawl')})}}</div>
          <div class="text-three margin-top-30">{{$t('RESERVE_RATIO_TIP')}}</div>
        </div>
        <div v-else class="text-three">
          {{$t('RESERVE_COMPENSATION_TIP', {amount:getAmount('claim','lockedBail'), asset:getAmount('claim','totalAmount')+gatewaySymbol, balance:getAmount('claim','userAmount')+gatewaySymbol, formula: '( '+getAmount('claim','userAmount')+'/'+getAmount('claim','totalAmount')+')'})
          }}
        </div>
      </div>
      <div class="row justify-center btn-container">
        <q-btn class="col-4 bottom-btn" color="secondary" @click="close" :label="$t('label.cancel')" />
        <q-btn class="col-4 bottom-btn" color="secondary" @click="submit" :label="$t('label.ok')" />
      </div>
    </div>
  </q-modal>
</template>

<script>
import { QModal, QBtn, QInput, QField } from 'quasar'
import { convertFee } from '../utils/asch'
import { mapGetters } from 'vuex'
import { secondPwd, intStrReg } from '../utils/validators'
import { required } from 'vuelidate/lib/validators'
import { BigNumber } from 'bignumber.js'

export default {
  name: 'PromptModal',
  components: {
    QModal,
    QBtn,
    QInput,
    QField
  },
  props: ['show', 'title', 'type', 'gateway'], // type 1 add , type 2 return ,type 3 compensation
  data() {
    return {
      addForm: {
        val: ''
      },
      returnForm: {
        val: ''
      },
      compensationForm: {
        val: ''
      },
      secondPwd: ''
    }
  },
  validations: {
    addForm: {
      val: {
        required,
        gtZero(value) {
          return this.numberCheck(value)
        }
      }
    },
    returnForm: {
      val: {
        required,
        gtZero(value) {
          return this.numberCheck(value)
        }
      }
    },
    compensationForm: {
      val: {
        required,
        gtZero(value) {
          return this.numberCheck(value)
        }
      }
    },
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  mounted() {
    this.initFrom()
  },
  methods: {
    convertFee,
    submit() {
      const secondPwd = this.secondPwd
      let secondPwdFlag = this.secondSignature && this.$v.secondPwd.$error
      if (secondPwdFlag) {
        return null
      }
      this.$v[this.getFormName].$touch()
      if (this.$v[this.getFormName].$error) {
        return null
      }
      let amount = BigNumber(+this.getForm.val)
        .times(Math.pow(10, 8))
        .toString()
      let form = {
        type: this.type,
        amount,
        secondPwd
      }
      this.$emit('submit', form)
      this.$emit('close')
    },
    getAmount(props, attr, precision = 8) {
      let gateway = this.gateway
      let value = gateway && gateway[props] ? gateway[props][attr] : 0
      value = value || 0
      return attr === 'ratio'
        ? (value * 100).toFixed(2)
        : convertFee(value, gateway[props] ? gateway[props].precision : undefined)
    },
    initFrom() {},
    numberCheck(value) {
      return intStrReg.test(value) && Number(value) > 0
    },
    close() {
      this.$emit('close')
      this.getForm.val = ''
      this.secondPwd = ''
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
    address() {
      return this.user.account.address
    },
    getForm() {
      const formName = ['placeholder', 'addForm', 'returnForm', 'compensationForm']
      return this[formName[this.type]]
    },
    getFormName() {
      return ['placeholder', 'addForm', 'returnForm', 'compensationForm'][this.type]
    },
    // compensationAmount() {
    //   let gateway = this.gateway
    //   let amount = gateway && gateway.claim ? gateway.claim.realClaim : 0
    //   return convertFee(amount)
    // },
    // bailAmount() {
    //   let gateway = this.gateway
    //   let amount = gateway && gateway.claim ? gateway.claim.lockedBail : 0
    //   return convertFee(amount)
    // },
    // totalBailAmount() {
    //   let gateway = this.gateway
    //   let amount = gateway && gateway.bail ? gateway.bail.totalBail : 0
    //   return convertFee(amount)
    // },
    // reserveAmount() {
    //   let gateway = this.gateway
    //   let amount = gateway && gateway.status ? gateway.status.currentBail : 0
    //   return convertFee(amount)
    // },
    // reserveRatio() {
    //   let gateway = this.gateway
    //   let ratio = gateway && gateway.bail ? (gateway.status.ratio * 100).toFixed(2) : 0
    //   return ratio
    // },
    gatewaySymbol() {
      if (this.gateway.claim) {
        return this.gateway.claim.symbol
      }
    },
    getewayPrecision() {
      return this.gateway.claim.precision
    }
  },
  watch: {
    show(val) {
      if (this.type === 3) this.compensationForm.val = this.getAmount('claim', 'realClaim')
    },
    type(val) {
      if (val === 3) this.compensationForm.val = this.getAmount('claim', 'realClaim')
    }
  }
}
</script>

<style lang="stylus" scoped>
.modal-title {
  display: block;
  padding: 20px 30px;
  width: 100%;
  font-size: 22px;
  color: #ffffff;
  background: #43AEA8;
}
</style>