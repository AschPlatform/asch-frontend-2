<template>
  <q-modal content-classes="withdraw-modal-container row justify-center" v-model="show" :no-esc-dismiss="true">
    <div class="col-12 widthdraw-modal-content">
      <div class="bg-secondary padding-40 height-62">
        <span class="text-white font-18">{{$t('WITHDRAW')}} </span>
        <span v-if="isDesk" class="font-12 text-white">{{$t('DEPOSIT_TIP2')}} </span>
        </div>
      <div  class="row justify-center padding-40">
        <q-field class="col-12 margin-top-54" :error-label="$t('ERR_RECIPIENT_ADDRESS_FORMAT')" >
        <q-input :float-label="$t('RECIPIENT')" @blur="$v.form.address.$touch" v-model="form.address" :error="$v.form.address.$error" />
        </q-field>
        <q-field class="col-12 margin-top-54" :error-label="$t('ERR_AMOUNT_INVALID')">
         <q-input :float-label="$t('AMOUNTS_FEE')" @blur="$v.form.amount.$touch" v-model="form.amount" :error="$v.form.amount.$error"  />
        </q-field>
        <q-field class="col-12 margin-top-54" :error-label="$t('ERR_FEE_INVALID',{fee:fee})">
         <q-input :float-label="$t('FEES')" @blur="$v.form.fee.$touch" v-model="form.fee" :error="$v.form.fee.$error"  />
        </q-field>
        <q-field class="col-12 margin-top-54" >
          <q-select
            v-model="currency"
            :float-label="$t('DAPP_CATEGORY')"
            :options="assetsOpt" />
            <p v-if="currency" >{{$t('AVAILABLE_BALANCE')}}{{balance | fee(precision)}}</p>
        </q-field>
        <q-field v-if="secondSignature" class="col-12 margin-top-54">
          <q-input :float-label="$t('TRS_TYPE_SECOND_PASSWORD')" v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
        </q-field>
       
        <div class="row col-12 justify-around q-mt-lg margin-top-54">
          <q-btn class="col-4" outline big color="secondary" :label="$t('label.cancel')" @click="close" />
          <q-btn class="col-4" big color="secondary" :disable="btnDisable" :label="$t('WITHDRAW')" @click="withdraw"/>
        </div>
      </div>
    </div>
    
  </q-modal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { QField, QInput, QModal, QSelect, QBtn } from 'quasar'
import { secondPwd, amountStrReg } from '../utils/validators'
import { required } from 'vuelidate/lib/validators'
import { toast, translateErrMsg } from '../utils/util'
import { convertFee } from '../utils/asch'
import { fees } from '../utils/constants'
import asch from '../utils/asch-v2'
import { BigNumber } from 'bignumber.js'

export default {
  name: 'WithdrawModal',
  props: ['user', 'asset', 'show'],
  components: { QField, QInput, QModal, QSelect, QBtn },
  data() {
    return {
      currency: '',
      secondPwd: '',
      form: {
        address: '',
        amount: '',
        fee: '',
        currency: ''
      },
      balance: '',
      precision: 0,
      fee: '',
      balances: [],
      btnDisable: false
    }
  },
  validations: {
    form: {
      address: {
        required
      },
      amount: {
        required,
        gtZero(value) {
          return amountStrReg.test(value) && Number(value) > 0
        },
        getPrecision(value) {
          let arr = value.split('.')
          if (arr.length === 1) {
            return true
          } else {
            return arr[1].length <= this.precision
          }
        }
      },
      fee: {
        required,
        gtZero(value) {
          return amountStrReg.test(value) && Number(value) > 0
        },
        getPrecision(value) {
          if (!value) return false
          let arr = value.split('.')
          if (arr.length === 1) {
            return true
          } else {
            return arr[1].length <= this.precision
          }
        },
        largeThan(val) {
          return Number(val) >= this.fee
        }
      }
    },
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  async mounted() {
    if (this.user) {
      this.getOutBalances()
    }
  },
  methods: {
    ...mapActions(['broadcastTransaction', 'getBalances']),
    async getOutBalances() {
      let res = await this.getBalances({
        address: this.user.account.address,
        flag: 3
      })
      if (res.success) {
        this.balances = res.balances
        this.currency = ''
        this.currency = this.asset.currency
      }
    },
    async withdraw() {
      this.$v.form.$touch()

      let secondPwdFlag = this.secondSignature && this.$v.secondPwd.$error
      if (secondPwdFlag) {
        return null
      }
      if (this.$v.form.$error) {
        return null
      }
      let amount = BigNumber(this.form.amount)
        .times(Math.pow(10, this.precision))
        .toString()

      let fee = BigNumber(this.form.fee)
        .times(Math.pow(10, this.precision))
        .toString()

      let trans = asch.withdrawGateway(
        this.form.address,
        this.asset.asset.gateway,
        this.asset.currency,
        amount,
        fee,
        this.user.secret,
        this.secondPwd
      )
      let res = await this.broadcastTransaction(trans)
      if (res.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        this.close()
      } else {
        translateErrMsg(this.$t, res.error)
        this.disableBtn('btnDisable')
      }
    },
    close() {
      this.form = {
        address: '',
        amount: '',
        fee: '',
        currency: ''
      }
      this.$emit('close')
    },
    info(msg) {
      toast(msg)
    },
    disableBtn(model) {
      this[model] = true
      this._.delay(() => {
        this[model] = false
      }, 3000)
    }
  },
  computed: {
    ...mapGetters(['outAssets']),
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : ''
    },
    assetsOpt() {
      let values = Object.values(this.outAssets)
      let arr = values.map(asset => {
        return {
          label: asset.symbol,
          value: asset.symbol
        }
      })
      return arr
    },
    assetsMap() {
      let assetsMap = {}
      this.balances.forEach(asset => {
        assetsMap[asset.currency || asset.symbol] = asset
      })
      return assetsMap
    },
    address() {
      let asset = this.assetsMap[this.sy]
      return asset ? asset.address : null
    }
  },
  watch: {
    show(val) {
      if (this.asset) {
        let currency = this.asset.currency || this.asset.symbol
        this.currency = currency
        if (currency && this.assetsMap[currency]) {
          this.balance = this.assetsMap[currency].balance
          this.precision = this.assetsMap[currency].asset.precision
          this.form.fee = convertFee(fees[currency], this.precision)
          this.fee = convertFee(fees[currency], this.precision)
        } else {
          return ''
        }
      }
    },
    user(val) {
      if (val) this.getOutBalances()
    }
  }
}
</script>
<style lang="stylus" scoped>
.widthdraw-modal-content {
  padding-bottom: 54px;
  max-width 490px
}
.withdraw-modal-container
  max-width 490px
.margin-top-54 {
  margin-top: 54px;
}
</style>