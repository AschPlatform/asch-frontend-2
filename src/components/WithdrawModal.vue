<template>
  <q-modal content-classes="row justify-center" v-model="show" :no-esc-dismiss="true">
    <div class="col-12 widthdraw-modal-content">
      <!-- <h4>{{$t('WITHDRAW')}}</h4> -->
      <div class="bg-secondary padding-40 height-62">
        <span class="text-white font-24">{{$t('WITHDRAW')}} </span>
        <span class="font-12 text-white">{{$t('DEPOSIT_TIP2')}} </span>
        </div>
      <div  class="row justify-center padding-40">
        <q-field class="col-12 margin-top-54">
        <q-input :float-label="$t('RECIPIENT')" @blur="$v.form.address.$touch" v-model="form.address" :error="$v.form.address.$error" :error-label="$t('ERR_RECIPIENT_ADDRESS_FORMAT')" />
        </q-field>
        <q-field class="col-12 margin-top-54">
         <q-input :float-label="$t('AMOUNTS')" @blur="$v.form.amount.$touch" v-model="form.amount" type="number" :decimals="1" :error="$v.form.amount.$error" :error-label="$t('ERR_AMOUNT_INVALID')" />
        </q-field>
        <q-field class="col-12 margin-top-54" >
          <q-select
            v-model="currency"
            :float-label="$t('DAPP_CATEGORY')"
            :options="assetsOpt" />
            <p v-if="currency" >{{$t('AVAILABLE_BALANCE')}}{{balance | fee(precision)}}</p>
        </q-field>
        <q-field v-if="secondSignature" class="col-12 margin-top-54">
          <q-input :float-label="$t('SECOND_PASSWORD')" v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
        </q-field>
       
        <div class="row col-12 justify-around q-mt-lg margin-top-54">
          <q-btn class="col-4" outline big color="secondary"  @click="close" :label="$t('label.cancel')"/>
          <q-btn class="col-4" big color="secondary" @click="withdraw" :label="$t('WITHDRAW')"/>
        </div>
      </div>
    </div>
    
  </q-modal>
</template>
<script>
import { mapActions } from 'vuex'
import { QField, QInput, QModal, QSelect, QBtn } from 'quasar'
import { secondPwd } from '../utils/validators'
import { required, minValue } from 'vuelidate/lib/validators'
import { toast, translateErrMsg } from '../utils/util'
import asch from '../utils/asch-v2'

export default {
  name: 'WithdrawModal',
  props: ['user', 'assets', 'asset', 'show'],
  components: { QField, QInput, QModal, QSelect, QBtn },
  data() {
    return {
      currency: '',
      secondPwd: '',
      form: {
        address: '',
        amount: '',
        fee: '0.1',
        remark: '',
        currency: ''
      },
      balance: '',
      precision: 0
    }
  },
  validations: {
    form: {
      address: {
        required
      },
      amount: {
        required,
        minValue: minValue(1)
      },
      receiver: {
        required
      }
    },
    secondPwd: {
      secondPwd: secondPwd()
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['broadcastTransaction']),
    async withdraw() {
      this.$v.form.$touch()

      let secondPwdFlag = this.secondSignature && this.$v.secondPwd.$error
      if (secondPwdFlag) {
        return null
      }
      if (this.$v.form.$error) {
        return null
      }

      let trans = asch.withdrawGateway(
        this.form.address,
        this.asset.currency,
        this.form.amount,
        this.user.secret,
        this.secondPwd
      )
      let res = await this.broadcastTransaction(trans)
      if (res.success) {
        toast(this.$t('INF_OPERATION_SUCCEEDED'))
        this.close()
      } else {
        translateErrMsg(this.$t, res.error)
      }
    },
    close() {
      this.$emit('close')
    },
    info(msg) {
      toast(msg)
    }
  },
  computed: {
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : ''
    },
    assetsOpt() {
      return this.assets.map(asset => {
        return {
          label: asset.currency,
          value: asset.currency
        }
      })
    },
    assetsMap() {
      let assetsMap = {}
      this.assets.forEach(asset => {
        assetsMap[asset.currency] = asset
      })
      return assetsMap
    },
    address() {
      let asset = this.assetsMap[this.sy]
      return asset ? asset.address : null
    }
  },
  watch: {
    currency(val) {
      if (val && this.assetsMap[val]) {
        this.balance = this.assetsMap[val].balance
        this.precision = this.assetsMap[val].precision
      } else {
        return ''
      }
    },
    asset(val) {
      this.currency = val.symbol
    }
  }
}
</script>
<style lang="stylus" scoped>
.widthdraw-modal-content {
  padding-bottom: 54px;
}

.margin-top-54 {
  margin-top: 54px;
}

.padding-40 {
  padding: 0 40px;
}
</style>