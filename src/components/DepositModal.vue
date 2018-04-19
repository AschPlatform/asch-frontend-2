<template>
  <q-modal content-classes="row justify-center" v-model="show" :no-esc-dismiss="true">
    <div class="col-6">
      <h4>{{$t('DEPOSIT')}}</h4>
      <div v-if="hasAdd" class="row justify-center">
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
        :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')"
        >
        <q-input :float-label="$t('TRS_TYPE_SECOND_PASSWORD')" v-model="secondPwd" type="password" />
      </q-field>
      <br />
      <div class="row justify-around">
        <q-btn rounded color="primary" :label="$t('OPEN_ADDR')" @click="openAddr" />
        <q-btn rounded :label="$t('CANCEL')" @click="$emit('close')" />
      </div>
    </div>
    
      
    </div>
    
  </q-modal>
</template>
<script>
import { mapActions } from 'vuex'
import { QField, QInput } from 'quasar'
import VueQr from 'vue-qr'
import { secondPwdReg } from '../utils/validators'
import { toast, toastInfo, translateErrMsg } from '../utils/util'
import asch from '../utils/asch-v2'

export default {
  name: 'DepositPanel',
  props: ['user', 'assets', 'asset', 'show'],
  components: { QField, QInput, VueQr },
  data() {
    return {
      currency: '',
      secondPwd: ''
    }
  },
  mounted() {
    if (this.asset) {
      this.currency = this.asset.symbol
    }
  },
  methods: {
    ...mapActions(['broadcastTransaction']),
    async openAddr() {
      if (this.secondSignature && !secondPwdReg.test(this.secondPwd)) {
        toastInfo(this.$t('ERR_SECOND_PASSWORD_FORMAT'))
        return null
      }
      let trans = asch.openGatewayAccount(this.asset.gateway, this.user.secret, this.secondPwd)
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
      let arr = this.assets.map(asset => {
        return {
          label: asset.symbol,
          value: asset.symbol
        }
      })
      if (this.asset && !this.asset.hasAdd) {
        arr.push({ label: this.asset.symbol, value: this.asset.symbol })
      }
      return arr
    },
    assetsMap() {
      let assetsMap = {}
      this.assets.forEach(asset => {
        assetsMap[asset.symbol] = asset
      })
      return assetsMap
    },
    address() {
      let asset = this.assetsMap[this.currency]
      return asset ? asset.address : null
    },
    hasAdd() {
      if (this.asset) {
        return this.asset.hasAdd
      } else {
        return false
      }
    }
  },
  watch: {
    asset(val) {
      this.currency = val.symbol
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>