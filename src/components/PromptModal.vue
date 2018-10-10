<template>
  <q-modal minimized content-class="modal-content-limit" no-backdrop-dismiss v-model="show" content-css="padding: 20px">
    <big>{{$t(title)}}</big>
    <q-field v-if="type==1" class="col-12 margin-top-54" :label="$t('LABEL_GATEWAY_ADD')" :error-label="$t('ERR_GATEWAY_ADD')">
      <q-input @blur="$v.addForm.val.$touch" v-model="addForm.val" :error="$v.addForm.val.$error" />
    </q-field>
    <q-field v-if="type==2" class="col-12 margin-top-54" :label="$t('LABEL_GATEWAY_ADD')" :error-label="$t('ERR_GATEWAY_ADD')">
      <q-input @blur="$v.returnForm.val.$touch" v-model="returnForm.val" :error="$v.returnForm.val.$error" />
    </q-field>
    <q-field v-if="type==3" :disabled="true" class="col-12 margin-top-54" :label="$t('LABEL_GATEWAY_ADD')" :error-label="$t('ERR_GATEWAY_ADD')">
      <q-input @blur="$v.compensationForm.val.$touch" v-model="compensationForm.address" :error="$v.compensationForm.val.$error" />
    </q-field>
    <q-field v-if="secondSignature" class="col-12 margin-top-54">
      <q-input :float-label="$t('TRS_TYPE_SECOND_PASSWORD')" v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
    </q-field>
    <br/>
    <div v-if="type>0" class="tips">
      <div>{{$t('TIP')}}</div>
      <div v-if="type<3">
        <div>{{$t(type==1?'RESERVE_ADD_TIP':'RESERVE_RETURN_TIP',{amount:getAmount('status','currentBail'),ratio:getAmount('status','ratio'),val:getAmount('status',type===1?'needSupply':'withdrawl')})}}</div>
        <div>{{$t('RESERVE_RATIO_TIP')}}</div>
      </div>
      <div v-else>
        {{$t('RESERVE_COMPENSATION_TIP',
        {amount:getAmount('claim','lockedBail'),
        asset:getAmount('claim','totalAmount')+gatewaySymbol,
        balance:getAmount('claim','userAmount')+gatewaySymbol,
        formula: '( '+getAmount('claim','userAmount')+'/'+getAmount('claim','totalAmount')+' )'
        })
        }}
      </div>
    </div>
    <q-btn color="primary" @click="$emit('close')" label="Close" />
    <q-btn color="primary" @click="submit" label="Close" />
  </q-modal>
</template>

<script>
import { QModal, QBtn, QInput, QField } from 'quasar'
import { convertFee } from '../utils/asch'
import { mapGetters } from 'vuex'
import { secondPwd } from '../utils/validators'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'PromptModal',
  components: {
    QModal,
    QBtn,
    QInput,
    QField
  },
  props: ['show', 'title', 'type', 'gateway'], // type 1 add , type 2 return ,type 0 compensation
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
        required
      }
    },
    returnForm: {
      val: {
        required
      }
    },
    compensationForm: {
      val: {
        required
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
    submit() {},
    getAmount(props, attr, precision = 8) {
      let gateway = this.gateway
      let value = gateway && gateway[props] ? gateway[props][attr] : 0
      return attr === 'ratio'
        ? value.toFixed(2)
        : convertFee(value, gateway[props] ? gateway[props].precision : undefined)
    },
    initFrom() {
      let type = this.type
      if (type === 3) {
        this.compensationForm.val = convertFee(this.gateway.cliam.realClaim)
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
    address() {
      return this.user.account.address
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
      return this.gateway.claim.symbol
    }
  },
  watch: {
    type(val) {
      // if (val && val < 3) {
      //   // add or return
      //   this.getGatewayInfo()
      //   this.getGatewayAccountInfo()
      // }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>