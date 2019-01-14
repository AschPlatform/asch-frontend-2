<template>
  <div class="col-10 transPanel-container" v-if="asset">
    <div class="bg-secondary transfer-top-container" v-if="showTitle">
      <span class="text-white font-18">
          <i class="material-icons">border_color</i>
        </span>
      <span class="text-white font-18">
              {{$t('TRS_TYPE_TRANSFER')}}
        </span>
      <span v-if="isDesk" class="text-white font-12">
           {{$t('PAY_TIP')}}
        </span>
    </div>
    <div class="transfer-top-Portraits row justify-center" v-if="showTitle">
      <jdenticon class="transfer-jdenticon" :address="form.receiver" :size="60" />
    </div>
    <div class="transfer-bottom-container" v-if="user && user.account">
      <q-field class="col-8 text-four" :label="$t('RECIPIENT')+':'" :label-width="3" :error-label="$t('ERR_RECIPIENT_ADDRESS_FORMAT')">
        <q-input class="col-8 font-12" @blur="$v.form.receiver.$touch" v-model="form.receiver" :error="$v.form.receiver.$error" :placeholder="$t('RECIPIENT_NAME_ADDRESS')" />
      </q-field>
      <q-field class="col-12" :label="$t('DAPP_CATEGORY')+':'" :label-width="3">
        <q-select v-model="form.currency" :options="assetsOpt" />
        <p class="text-secondary font-12" v-if="form.currency">{{$t('AVAILABLE_BALANCE')}}{{balance | fee(precision)}}</p>
      </q-field>
      <q-field class="col-12" :label="$t('AMOUNTS')+':'" :label-width="3" :error-label="$t('ERR_AMOUNT_INVALID')">
        <q-input class="font-12" @blur="$v.form.amount.$touch" v-model="form.amount" :error="$v.form.amount.$error" />
      </q-field>
      <q-field v-if="secondSignature" class="col-12" :label="$t('TRS_TYPE_SECOND_PASSWORD')+':'" :label-width="3" :error-label="$t('ERR_SECOND_PASSWORD_FORMAT')">
        <q-input v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
      </q-field>
      <!-- <q-field class="col-12" :label="$t('TRANSFER_FEE')+':'" :label-width="3" :error-label="$t('ERR_GAS_NUM_WRONG')">
        <div v-if="!isContractPay" class="row justify-center col-12 custom-transpanel-btns">
          <q-btn-toggle class="row col-12 no-shadow" v-model="feeType" toggle-color="secondary" :options="[
      {label: this.$t('FEES'), value: 1},
      {label: this.$t('GAS'), value: 0},
    ]" />
        </div>
        
        <q-input class="fee-input" v-if="feeType===1" disable v-model="form.fee" />
        <q-input v-else class="gas-input" style="border:none" v-model="form.gas" :decimals="8" @blur="$v.form.gas.$touch" :error="$v.form.gas.$error" :placeholder="feeCount"/>
        <p v-if="feeType!==1" class="text-secondary font-12 q-mb-xs">{{$t('AVAILABLE_BALANCE')}}{{BCHAccount | fee(8)}}</p>
      </q-field> -->
      <q-field class="col-12" :label="$t('REMARK')+':'" :label-width="3" :error-label="$t('ERR_INVALID_REMARK')">
        <q-input ref="remark" :helper="$t('REMARK_TIP')+'0 ~ 255'" @blur="$v.form.remark.$touch" v-model="form.remark" :error="$v.form.remark.$error" />
      </q-field>
      <q-field class="col-12" :label="$t('TRANSFER_FEE')+':'" :label-width="3" :error-label="$t('ERR_GAS_NUM_WRONG')">
        <div class="inner-box col-12 bg-nine">
          <q-input class="inner-fee" readonly :value="netForTransfer ? '1000' : '0.1'" :suffix="netForTransfer ? 'Bandwidth Ponint' : 'XAS'"/>
          <div v-show="netForTransfer">{{$t('TRANSFER_NET_ENOUGH', {amount: (pledgeDetail.netLimit || 0 - pledgeDetail.netUsed || 0) + (pledgeDetail.freeNetLimit || 0 - pledgeDetail.freeNetUsed || 0), free: (pledgeDetail.freeNetLimit || 0) - (pledgeDetail.freeNetUsed || 0)})}}</div>
          <div v-show="!netForTransfer">{{$t('TRANSFER_NET_NOT_ENOUGH', {amount: (pledgeDetail.netLimit || 0 - pledgeDetail.netUsed || 0) + (pledgeDetail.freeNetLimit || 0 - pledgeDetail.freeNetUsed || 0), free: pledgeDetail.freeNetLimit || 0 - pledgeDetail.freeNetUsed || 0})}}</div>
        </div>
        <!-- <div v-else class="inner-box col-12 bg-nine">
          <q-input class="inner-fee" v-model="form.gas" :decimals="8" @blur="$v.form.gas.$touch" :error="$v.form.gas.$error" :placeholder="$t('TRANSFER_ENERGY_TIP')" :suffix="'XAS'"/>
          <div>{{$t('TRANSFER_ENERGY_ENOUGH', {amount: (pledgeDetail.energyLimit - pledgeDetail.energyUsed), count: pledgeDetail.energyLimit / (pledgeDetail.energyPerPledgedXAS * Math.pow(10, 8))})}}</div>
          <div v-show="!netForTransfer">{{$t('TRANSFER_ENERGY_NOT_ENOUGH', {amount: (pledgeDetail.energyLimit - pledgeDetail.energyUsed)})}}</div>
        </div> -->
      </q-field>
      <div class="panelBtn col-6">
        <slot name="btns" :send="send" :cancel="cancel" />
      </div>
    </div>
  </div>
</template>

<script>
import { toastWarn, toast, translateErrMsg } from '../utils/util'
import asch, { dealGiantNumber } from '../utils/asch'
import { secondPwd, amountStrReg } from '../utils/validators'
import { required, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Jdenticon from '../components/Jdenticon'
import { QField, QInput, QSelect, QBtnToggle } from 'quasar'

export default {
  props: ['user', 'asset', 'showTitle'],
  components: {
    Jdenticon,
    QField,
    QInput,
    QSelect,
    QBtnToggle
  },
  data() {
    return {
      form: {
        from: '',
        receiver: '',
        amount: '',
        fee: '0.1 XAS',
        remark: '',
        currency: '',
        gas: ''
      },
      secondPwd: '',
      balance: '',
      precision: 0,
      feeType: 1, // 1 XAS, 0 BCH
      isContractPay: false
    }
  },
  validations: {
    form: {
      amount: {
        required,
        gtZero(value) {
          return amountStrReg.test(value)
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
      receiver: {
        required
      },
      remark: {
        maxLength: maxLength(255)
      },
      gas: {
        // required,
        validate(value) {
          if (this.feeType === 1) {
            return true
          } else {
            return amountStrReg.test(value)
          }
        }
      }
    },
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  methods: {
    ...mapActions([
      'broadcastTransaction',
      'getBalances',
      'payContract'
    ]),
    ...mapMutations(['setBalances']),
    async send() {
      this.$v.form.$touch()
      let invlaidPwd = false
      let { amount, receiver, remark } = this.form
      receiver = receiver.trim()
      if (this.feeType === 0) {
        this.$v.form.gas.$touch()
      }
      if (this.secondSignature) {
        this.$v.secondPwd.$touch()
        invlaidPwd = this.$v.secondPwd.$error
      }
      if (invlaidPwd) {
        toastWarn(this.$t('ERR_SECOND_PASSWORD_FORMAT'))
        return false
      }
      if (this.$v.form.$error) {
        toastWarn(this.$t('LAUNCH_MODAL.ERR_INVALID_FORM'))
        return false
      }
      if (receiver === this.user.account.address) {
        toastWarn(this.$t('ERR_RECIPIENT_EQUAL_SENDER'))
        return false
      }
      if (this.user.account.name && receiver === this.user.account.name) {
        toastWarn(this.$t('ERR_RECIPIENT_EQUAL_SENDER'))
        return false
      }

      // amount = BigNumber(amount)
      //   .times(Math.pow(10, this.precision))
      //   .toString()
      amount = dealGiantNumber(amount, this.precision)
      let trans = {}
      let fee = 10000000

      // if (this.feeType === 0 || this.isContractPay) {
      //   // fee = BigNumber(-Number(this.form.gas))
      //   //   .times(Math.pow(10, 8))
      //   //   .toString()
      //   fee = dealGiantNumber(-Number(this.form.gas), 8)
      // }
      let res
      if (this.form.currency === 'XAS') {
        // fee = BigNumber(fee)
        //   .times(Math.pow(10, this.precision))
        //   .toString()
        trans = asch.transferXAS(
          amount,
          receiver,
          remark,
          this.user.secret,
          this.secondPwd,
          Number(fee)
        )
      } else {
        trans = asch.transferAsset(
          this.form.currency,
          amount,
          receiver,
          remark,
          this.user.secret,
          this.secondPwd,
          Number(fee)
        )
      }
      res = await this.broadcastTransaction(trans)

      if (res.success === true) {
        toast(this.$t('INF_TRANSFER_SUCCESS'))
        this.resetForm()
        return true
      } else {
        translateErrMsg(this.$t, res.error)
        return false
      }
    },
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.form = {
        receiver: '',
        amount: '',
        secondPwd: '',
        fee: '0.1 XAS',
        remark: '',
        currency: ''
      }
      // this.$refs.remark.focus()
      this._.delay(() => {
        this.$v.form.$reset()
        this.$v.secondPwd.$reset()
      }, 60)
    },
    async refreshBalances() {
      let res = await this.getBalances({
        address: this.user.account.address
      })
      if (res.success) {
        this.setBalances(res.balances)
      }
    }
    // async getBncorsPairs() {
    //   let result = await this.getBancorPairs()
    //   if (result.success) {
    //     let bancors = result.bancors
    //     this.bancorStatue = bancors[0]
    //   }
    // },
    // async queryCostGas() {
    //   let xasFee = 10000000
    //   let res = await this.getCostGas({ amount: xasFee })
    //   if (res.success) {
    //     this.costGas = convertFee(res.data)
    //   }
    // }
  },
  mounted() {
    if (this.asset) {
      let { currency, precision, balance } = this.asset
      this.form.currency = currency
      this.balance = balance
      this.precision = precision
    }
    // this.queryCostGas()
  },
  computed: {
    ...mapGetters(['balances', 'userInfo', 'pledgeDetail']),
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : null
    },
    assetsOpt() {
      let arr = this.balances.map(asset => {
        return {
          label: asset.currency,
          value: asset.currency
        }
      })
      arr = [
        {
          label: 'XAS',
          value: 'XAS'
        }
      ].concat(arr)
      return arr
    },
    assetsMap() {
      let assetsMap = {}
      this.balances.forEach(asset => {
        assetsMap[asset.currency] = asset
      })
      if (!assetsMap['XAS']) {
        assetsMap['XAS'] = {
          name: 'XAS',
          precision: 8,
          balance: this.userInfo.account.xas
        }
      }
      return assetsMap
    },
    // feeCount() {
    //   return this.isContractPay
    //     ? this.$t('CONTRACT_GAS_LIMIT_TIP', { num: 0.1 })
    //     : this.$t('COUNTED_FEE') + (this.costGas || 0) + ' BCH'
    // },
    netForTransfer() {
      if (Object.keys(this.pledgeDetail).indexOf('netLimit') >= 0) {
        return this.pledgeDetail.netLimit - this.pledgeDetail.netUsed > 1000 || this.pledgeDetail.freeNetLimit - this.pledgeDetail.freeNetUsed > 1000
      }
      return false
    }
  },
  watch: {
    'form.currency'(val) {
      if (val && this.assetsMap[val]) {
        this.balance = this.assetsMap[val].balance
        this.precision = this.assetsMap[val].precision
        if (this.assetsMap[val].asset) {
          this.precision = this.assetsMap[val].asset.precision
        }
      }
    },
    // 'form.receiver'(val) {
    //   if (smartAddressReg.test(val)) {
    //     this.feeType = 0
    //     this.isContractPay = true
    //   } else {
    //     this.isContractPay = false
    //   }
    // },
    asset(val) {
      if (!this.form.currency) this.form.currency = val.currency
    },
    user(val) {
      this.refreshBalances()
      // this.queryCostGas()
    }
  }
}
</script>

<style lang="stylus" scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.transPanel-container {
  padding-bottom: 50px;
}

.transfer-top-container {
  padding: 0 50px;
  height: 62px;
  line-height: 62px;
}

.transfer-bottom-container {
  padding: 0 50px;
}

.transfer-top-Portraits {
  padding: 20px 0;
}

.transfer-jdenticon {
  border-radius: 50%;
}

.panelBtn {
  margin-top: 30px;
}

.q-field-label {
  color: #333333 !important;
  font-size: 16px;
}

.q-input-target {
  color: #999999 !important;
  font-size: 16px;
}

.inner-box
  padding 0 20px 20px 20px
  .inner-fee
    margin-bottom 20px
</style>
