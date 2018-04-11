<template>
  <q-modal content-classes="row justify-center" v-model="show" maximized :no-esc-dismiss="true">
    <div class="col-6">
      <h4>{{$t('DEPOSIT')}}</h4>
      <div v-if="haveAdd" class="row justify-center">
        <vue-qr :size="200" :text="address || 'no data'"></vue-qr>
        <br />
        <div class="col-12 justify-center" >{{address}} <q-btn v-clipboard="address || 'no data'" @success="info('copy success...')" flat icon='file' round/></div>
        <p>{{$t('DEPOSIT_TIP',{ currency: currency })}}</p>
        <q-field class="col-12" >
          <q-select
            v-model="currency"
            :float-label="$t('DAPP_CATEGORY')"
            :options="assetsOpt" />
      </q-field>
        <q-btn color="primary" @click="close" :label="$t('label.close')"/>
      </div>
    <div v-else >
      <h5>{{$t('DEPOSIT_NO_ADDR_TIP',{ currency: currency })}}</h5>
      <q-field >
      <q-select
        v-model="currency"
        :float-label="$t('DAPP_CATEGORY')"
        :options="assetsOpt" />
      </q-field>
      <q-field v-if="secondSignature"
        :label="$t('TRS_TYPE_SECOND_PASSWORD')"
        :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"
        :label-width="4">
        <q-input v-model="secondPwd" type="password" />
      </q-field>
      <q-btn rounded :label="$t('OPEN_ADDR')" @click="openAddr" />
    </div>
    
      
    </div>
    
  </q-modal>
</template>
<script>
import { mapActions } from 'vuex'
import { QField, QInput } from 'quasar'
import VueQr from 'vue-qr'
import { secondPwdReg } from '../utils/validators'
import { toast } from '../utils/util'

export default {
  name: 'DepositPanel',
  props: ['user', 'assets', 'asset', 'show', 'haveAdd'],
  components: { QField, QInput, VueQr },
  data() {
    return {
      currency: '',
      secondPwd: ''
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['openAddress']),
    async openAddr() {
      console.log('openaddr')
      if (this.secondSignature && !secondPwdReg.test(this.secondPwd)) {
        return null
      }
      await this.openAddress()
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
    asset(val) {
      this.currency = val.currency
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>