<template>
  <q-modal class="deposit-modal-container" content-classes="modal-content-limit row justify-center" v-model="show" no-backdrop-dismiss :no-esc-dismiss="true">
    <div class="col-12 padding-b-54 ">
      <!-- <h4>{{$t('DEPOSIT')}}</h4> -->
      <div class="bg-secondary padding-40 height-62">
        <span class="text-white font-18">{{$t('DEPOSIT')}}</span>
      </div>
      <div v-if="account&&account.outAddress">
        <vue-qr class="depositmodal-account-content" :size="200" :text="account.outAddress?'bitcoin:'+account.outAddress:'no data'"></vue-qr>
        <br />
        <div class="col-6 text-center font-14" >{{account.outAddress}} <q-btn v-clipboard="account.outAddress || 'no data'" @success="info('copy success...')" flat color="secondary" icon='content copy' round/></div>
        <div class="padding-40 deposit-text col-6 font-14 text-five">{{$t('DEPOSIT_TIP',{ currency: currency })}}</div>
        <q-field class="padding-40 col-9" >
          <q-select
            v-model="currency"
            :float-label="$t('DAPP_CATEGORY')"
            :options="assetsOpt" />
        </q-field>
        <div class="row justify-center margin-t-20">
        <q-btn color="secondary" @click="close" :label="$t('label.close')"/>
        </div>
      </div>
      <div class="padding-40" v-else>
      <h5 class="font-18">{{$t('DEPOSIT_NO_ADDR_TIP',{ currency: currency })}}</h5>
      <q-field >
      <q-select
        v-model="currency"
        :float-label="$t('DAPP_CATEGORY')"
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
import asch from '../utils/asch-v2'

export default {
  name: 'DepositPanel',
  props: ['user', 'show', 'asset'],
  components: { QField, QInput, VueQr, QModal, QBtn, QSelect, QItemMain },
  data() {
    return {
      currency: '',
      secondPwd: '',
      account: {},
      btnDisable: false
    }
  },
  mounted() {
    if (this.asset) {
      this.currency = this.asset.symbol
    }
  },
  methods: {
    ...mapActions(['broadcastTransaction', 'gateAccountAddr']),
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
    async getAddr() {
      let asset = this.outAssets[this.currency]
      // this.asset = asset
      if (!asset || !asset.gateway) return
      let res = await this.gateAccountAddr({ name: asset.gateway, address: this.user.address })
      if (res.success) {
        this.account = res.account
      }
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
    }
  },
  watch: {
    asset(val) {
      if (val) this.currency = val.currency || val.symbol
      if (this.user && this.currency) this.getAddr()
    },
    currency(val) {
      if (this.user) this.getAddr()
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