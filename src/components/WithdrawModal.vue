<template>
  <q-modal content-classes="row justify-center" v-model="show" maximized :no-esc-dismiss="true">
    <div class="col-6">
      <h4>{{$t('WITHDRAW')}}</h4>
      <div  class="row justify-center">
        <q-field class="col-12">
        <q-input :float-label="$t('RECIPIENT')" @blur="$v.form.address.$touch" v-model="form.address" :error="$v.form.address.$error" :error-label="$t('ERR_RECIPIENT_ADDRESS_FORMAT')" />
        </q-field>
        <q-field class="col-12">
         <q-input :float-label="$t('AMOUNTS')" @blur="$v.form.amount.$touch" v-model="form.amount" type="number" :decimals="1" :error="$v.form.amount.$error" :error-label="$t('ERR_AMOUNT_INVALID')" />
        </q-field>
        <q-field class="col-12" >
          <q-select
            v-model="currency"
            :float-label="$t('DAPP_CATEGORY')"
            :options="assetsOpt" />
            <p v-if="currency" >{{$t('AVAILABLE_BALANCE')}}{{balance | fee(precision)}}</p>
        </q-field>
        <q-field v-if="secondSignature" class="col-12">
          <q-input :float-label="$t('SECOND_PASSWORD')" v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
        </q-field>
        <div class="row justify-between">
          <q-btn color="primary" @click="withdraw" :label="$t('WITHDRAW')"/>
          <q-btn color="primary" @click="close" :label="$t('label.close')"/>
        </div>
      </div>
      
    </div>
    
  </q-modal>
</template>
<script>
import { mapActions } from 'vuex'
import { QField, QInput } from 'quasar'
import { secondPwd } from '../utils/validators'
import { required, minValue } from 'vuelidate/lib/validators'
import { toast } from '../utils/util'

export default {
  name: 'DepositPanel',
  props: ['user', 'assets', 'asset', 'show', 'haveAdd'],
  components: { QField, QInput },
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
      }
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
    ...mapActions(['withdrawAsset']),
    async withdraw() {
      this.$v.form.$touch()

      let secondPwdFlag = this.secondSignature && this.$v.secondPwd.$error
      if (secondPwdFlag) {
        return null
      }
      if (this.$v.form.$error) {
        return null
      }

      await this.withdrawAsset()
      this.close()
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
      let asset = this.assetsMap[this.currency]
      return asset ? asset.address : null
    }
  },
  watch: {
    currency(val) {
      if (val) {
        this.balance = this.assetsMap[val].balance
        this.precision = this.assetsMap[val].precision
      }
    },
    asset(val) {
      this.currency = val.currency
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>