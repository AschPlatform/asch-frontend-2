<template>
  <q-modal class="deposit-modal-container" content-classes="row justify-center" v-model="show" no-backdrop-dismiss :no-esc-dismiss="true">
    <div class="col-12 padding-b-54 ">
      <!-- <h4>{{$t('DEPOSIT')}}</h4> -->
      <div class="bg-secondary padding-40 height-62">
        <span class="text-white font-18">{{$t('DEPOSIT')}}</span>
      </div>
      <div v-if="account&&account.outAddress">
        <!-- TODO: VR CONETNT -->
        <vue-qr v-if="status !== 0 && isSealed.revoked !== 2" class="depositmodal-account-content" :size="200" :text="qrText"></vue-qr>
        <div v-if="status === 1 && isSealed.revoked !== 2" class="text-primary padding-40 font-14 text-center">
          <i class="material-icons block font-60 align-center margin-t-54 margin-bottom-20">
            warning
          </i>
          {{$t('WARN_TIP', {rate: this.ratio})}}
        </div>
        <div v-if="isSealed.revoked === 2" class="text-primary padding-40 font-14 text-center">
          <i class="material-icons block font-60 align-center margin-t-54 margin-bottom-20">
            warning
          </i>
          {{$t('GATEWAY_ALREADY_FREEZED')}}
        </div>

        <br />
        <div class="col-6 text-center font-14" v-if="status !== 0 && isSealed.revoked !== 2">{{account.outAddress}} <q-btn v-clipboard="account.outAddress || 'no data'" @success="info($t('COPY_SUCCESS'))" flat color="secondary" icon='content copy' round/></div>
        <q-field class="padding-40 col-9" label-width="3" :label="$t('ASSET_CATEGORY')">
          <q-select
            v-model="currency"
            :options="assetsOpt" />
        </q-field>
        <!-- <q-field label-width="3" :label="$t('TIP')" class="padding-40 col-9">
          <div class="deposit-text font-14">{{tipContent}}</div>
        </q-field> -->
        <div class="margin-t-15" :class="tipColor" v-if="status !== 0 && isSealed.revoked !== 2">
          <div class="padding-40 font-14 font-bold">{{$t('TIP')}}</div>
          <div class="padding-40 deposit-text col-6 font-14">{{tipContent}}</div>
        </div>
        <div class="row justify-center margin-t-20">
        <q-btn color="secondary" @click="close" :label="$t('label.close')"/>
        </div>
      </div>
      <div class="padding-40" v-else>
        <q-field label-width="3">
          <h5 class="font-18">{{$t('DEPOSIT_NO_ADDR_TIP',{ currency: currency })}}</h5>
        </q-field>
        <q-field >
          <q-select
            v-model="currency"
            :float-label="$t('DAPP_CATEGORY_COST')"
            :options="assetsOpt" />
        </q-field>
        <q-field v-if="secondSignature"
          :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')">
          <q-input :float-label="$t('TRS_TYPE_SECOND_PASSWORD')" v-model="secondPwd" type="password" />
        </q-field>
        <br />
        <div class="row justify-around">
          <q-btn  :label="$t('CANCEL')" color="secondary" outline @click="$emit('close')" />
          <q-btn  color="secondary" :disable="btnDisable" :label="$t('OPEN_ADDR')" @click="openAddr" />
        </div>
      </div> 
    </div>
    
  </q-modal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { QField, QInput, QModal, QBtn, QSelect, QItemMain } from 'quasar'
import VueQr from 'vue-qr'
import { secondPwdReg } from '../utils/validators'
import { toast, toastInfo, translateErrMsg } from '../utils/util'
import asch from '../utils/asch'

export default {
  name: 'DepositModal',
  props: ['show', 'defaultName'],
  components: { QField, QInput, VueQr, QModal, QBtn, QSelect, QItemMain },
  data() {
    return {
      currency: '',
      secondPwd: '',
      account: {
        // outAddress: 'A6ozeC4vH7aBSGooefjjDnk8ThrdRMz7fv'
      },
      btnDisable: false,
      // below are mock
      // user: {
      //   select: 'ETH',
      //   address: 'A6ozeC4vH7aBSGooefjjDnk8ThrdRMz7fv',
      //   account: {
      //     secondPublicKey: 'A6ozeC4vH7aBSGooefjjDnk8ThrdRMz7fvA6ozeC4vH7aBSGooefjjDnk8ThrdRMz7fv'
      //   }
      // },
      // show: true,
      asset: {
        // symbol: 'ETH',
        // gateway: 'ETH GATEWAY'
      },
      bailInfo: {},
      outAddress: '',
      // Monitor the local modal change
      isDirty: false,
      isSealed: 0,
      gatewaysArr: []
      // rate: '76',
      // below is gateway status monitor
      // status: 1,
      // ratio: 0
    }
  },
  created() {
    // this.currency = this.defaultName.symbol
    // this.asset = this.defaultName
  },
  mounted() {
    this.currency = this.defaultName.symbol
    if (this.asset) {
      this.currency = this.asset.symbol
    }
    this.getGateway()
    // this.getGatewayInfomation()
  },
  methods: {
    ...mapActions(['broadcastTransaction', 'getGatewayInfo', 'gateAccountAddr', 'getCurrencies', 'getGateways']),
    async openAddr() {
      if (this.secondSignature && !secondPwdReg.test(this.secondPwd)) {
        toastInfo(this.$t('ERR_SECOND_PASSWORD_FORMAT'))
        return null
      }
      let trans = asch.openGatewayAccount(
        this.asset.gateway || this.asset.asset.gateway,
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
    },
    async getGateway() {
      let result = await this.getGateways({
        limit: 999,
        offset: 0
      })
      if (result.success) {
        let tempArr = []
        result.gateways.forEach(e => {
          tempArr[e.name] = e
        })
        this.gatewaysArr = tempArr
      }
    },
    async getAddr() {
      let asset = this.outAssets[this.currency]
      this.asset = asset
      this.isSealed = this.gatewaysArr[this.defaultName.name || this.outAssets[this.currency].gateway]
      if (!asset || !asset.gateway) return
      let res = await this.gateAccountAddr({ name: asset.gateway, address: this.user.address })
      if (res.success) {
        this.account = res.account
      }
    },
    async getGatewayInfomation(name) {
      let result = await this.getGatewayInfo({
        name: this.defaultName.name || this.outAssets[this.currency].gateway
      })
      if (result.success) {
        this.bailInfo = result
      }
    },
    async getOuterAddress() {
      let result = await this.gateAccountAddr({
        name: this.asset.gateway,
        address: this.user.account.address
      })
      if (result.success) {
        this.account.outAddress = result.account.address
        this.outAddress = result.account.address
      }
    }
  },
  computed: {
    ...mapGetters(['outAssets', 'userInfo']),
    secondSignature() {
      return this.user ? this.user.account.secondPublicKey : ''
    },
    user() {
      return this.userInfo
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
    address() {
      let asset = this.outAssets[this.currency]
      return asset ? asset.address : null
    },
    hasAdd() {
      if (this.asset) {
        return this.asset.hasAdd
      } else {
        return false
      }
    },
    tipContent() {
      // TODO: status detect
      if (this.status === 1) {
        return this.$t('DEPOSIT_TIP', {currency: this.currency})
      }
      return this.$t('ALERT_TIP', {rate: this.ratio})
    },
    tipColor() {
      // TODO: status detect
      if (this.status === 1) {
        return 'text-five'
      }
      return 'text-secondary'
    },
    ratio() {
      if (this.bailInfo && this.bailInfo.ratio) {
        return (this.bailInfo.ratio * 100).toFixed(2)
      }
      return 0
    },
    status() {
      if (this.ratio < 100 && this.ratio > 0) {
        return 0
      } else if (this.ratio > 100 && this.ratio < 120) {
        return 1
      } else {
        return 2
      }
    },
    // isSealed() {
    //   case
    // },
    qrText() {
      if (this.currency && this.account && this.account.outAddress) {
        return this.currency + ':' + this.account.outAddress
      }
      return 'no data'
    }
  },
  watch: {
    userInfo() {
      this.getCurrencies()
      this.getGateway()
    },
    asset(val) {
      if (val) this.currency = val.currency || val.symbol
      if (this.user && this.currency) {
        this.getAddr()
        // this.getOuterAddress()
        this.getGatewayInfomation()
      }
    },
    currency(val) {
      if (this.user) {
        this.getGateway()
        this.getAddr()
        // this.getOuterAddress()
      }
    },
    defaultName(val) {
      if (this.user) {
        this.currency = val.symbol
        this.getAddr()
        this.getGatewayInfomation()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.deposit-modal-container {
}

.deposit-text {
  max-width: 400px;
}

.depositmodal-account-content {
  text-align: center;
}
</style>