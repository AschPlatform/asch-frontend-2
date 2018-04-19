<template>
  <div class="col-10 transPanel-container" v-if="asset">
    <div class="bg-secondary transfer-top-container" v-if="showTitle">
      <span class="text-white font-22">
        <i class="material-icons">border_color</i>
      </span>
      <span class="text-white font-22">
            {{$t('TRS_TYPE_TRANSFER')}}
      </span>
      <span class="text-white font-12">
         {{$t('PAY_TIP')}}
      </span>
    </div>
    <div class="transfer-top-Portraits row justify-center" v-if="showTitle">
     <jdenticon class="transfer-jdenticon" :address="user.account.address" :size="60" />
    </div>
    <div class="transfer-bottom-container" v-if="user && user.account" >
      <q-field class="col-12 text-four" :label="$t('RECIPIENT')+':'" :label-width="3">
        <!-- <jdenticon  :address="form.receiver" :size="50" /> -->
        <q-input class="col-8" @blur="$v.form.receiver.$touch" v-model="form.receiver" :error="$v.form.receiver.$error" :error-label="$t('ERR_RECIPIENT_ADDRESS_FORMAT')" :placeholder="$t('RECIPIENT_NAME_ADDRESS')"/>
      </q-field>
      <q-field class="col-12" :label="$t('DAPP_CATEGORY')+':'" :label-width="3">
        <!-- <q-input v-if="currency" disable :float-label="$t('DAPP_CATEGORY')" v-model="currency" /> -->
         <q-select
          v-model="form.currency"
          :options="assetsOpt" />
          <p class="text-secondary font-12" v-if="form.currency" >{{$t('AVAILABLE_BALANCE')}}{{balance | fee(precision)}}</p>
      </q-field>
      <q-field class="col-12" :label="$t('AMOUNTS')+':'" :label-width="3">
        <q-input  @blur="$v.form.amount.$touch" v-model="form.amount" type="number" :decimals="1" :error="$v.form.amount.$error" :error-label="$t('ERR_AMOUNT_INVALID')" />
      </q-field>
      <q-field v-if="secondSignature" class="col-12"  :label="$t('TRS_TYPE_SECOND_PASSWORD')+':'" :label-width="3">
        <q-input v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
      </q-field>
      <q-field class="col-12" :label="$t('FEES')+':'" :label-width="3">
        <q-input disable  v-model="form.fee" />
      </q-field>
      <q-field class="col-12" :label="$t('REMARK')+':'" :label-width="3">
        <q-input :helper="$t('REMARK_TIP')+'0 ~ 255'" @blur="$v.form.remark.$touch" v-model="form.remark" :error="$v.form.remark.$error" :error-label="$t('ERR_INVALID_REMARK')" />
      </q-field>
      <div class="panelBtn col-6">
        <slot name="btns" :send="send" :cancel="cancel" />
      </div>
    </div>
  </div>
</template>

<script>
import { toastWarn, toast, translateErrMsg } from '../utils/util'
import asch from '../utils/asch-v2'
import { address, secondPwd } from '../utils/validators'
import { required, maxLength, minValue } from 'vuelidate/lib/validators'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Jdenticon from '../components/Jdenticon'
import { QField, QInput } from 'quasar'

export default {
  props: ['user', 'asset', 'showTitle'],
  components: { Jdenticon, QField, QInput },
  data() {
    return {
      form: {
        from: '',
        receiver: '',
        amount: '',
        fee: '0.1 XAS',
        remark: '',
        currency: ''
      },
      secondPwd: '',
      balance: '',
      precision: 0
    }
  },
  validations: {
    form: {
      amount: {
        required,
        minValue: minValue(1)
      },
      receiver: {
        required,
        address: address()
      },
      remark: {
        maxLength: maxLength(255)
      }
    },
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  methods: {
    ...mapActions(['broadcastTransaction', 'getBalances']),
    ...mapMutations(['setBalances']),
    async send() {
      this.$v.form.$touch()
      let invlaidPwd = false
      if (this.secondSignature) {
        this.$v.secondPwd.$touch()
        invlaidPwd = this.$v.secondPwd.$error
      }
      if (invlaidPwd || this.$v.form.$error) {
        return false
      }
      if (this.form.receiver === this.user.account.address) {
        toastWarn(this.$t('ERR_RECIPIENT_EQUAL_SENDER'))
        return false
      }

      let { amount, receiver, remark } = this.form
      amount = (amount * Math.pow(10, this.precision)).toFixed(0)
      let trans = {}
      if (this.form.currency === 'XAS') {
        trans = asch.transferXAS(amount, receiver, remark, this.user.secret, this.secondPwd)
      } else {
        trans = asch.transferAsset(
          this.form.currency,
          amount,
          receiver,
          remark,
          this.user.secret,
          this.secondPwd
        )
      }
      let res = await this.broadcastTransaction(trans)
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
        fee: '0.1',
        remark: ''
      }
      this.$v.form.$reset()
      this.$v.secondPwd.$reset()
    },
    async refreshBalances() {
      let res = await this.getBalances({ address: this.user.account.address })
      if (res.success) {
        this.setBalances(res.balances)
      }
    }
  },
  mounted() {
    if (this.asset) {
      let { currency, precision, balance } = this.asset
      this.form.currency = currency
      this.balance = balance
      this.precision = precision
    }
  },
  computed: {
    ...mapGetters(['balances', 'userInfo']),
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
      return [{ label: 'XAS', value: 'XAS' }].concat(arr)
    },
    assetsMap() {
      let assetsMap = {}
      this.balances.forEach(asset => {
        assetsMap[asset.currency] = asset
      })
      assetsMap['XAS'] = { name: 'XAS', precision: 8, balance: this.userInfo.account.xas }
      return assetsMap
    }
  },
  watch: {
    'form.currency'(val) {
      if (val && this.assetsMap[val]) {
        this.balance = this.assetsMap[val].balance
        this.precision = this.assetsMap[val].precision
      }
    },
    asset(val) {
      this.form.currency = val.currency
    },
    user(val) {
      this.refreshBalances()
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
  border: 1px solid #999999;
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
</style>
