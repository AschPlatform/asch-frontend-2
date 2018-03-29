<template>
  <q-modal v-model="show" maximized>
    <h4>{{$t('DEPOSIT')}}</h4>
    <div v-if="haveAdd">
      <vue-qr :size="100" :text="address"></vue-qr>
      <div >{[address]} <q-btn v-clipboard="address" @success="info('copy success...')" flat icon='file' round/></div>
      <q-select
          v-model="currency"
          :float-label="$t('DAPP_CATEGORY')"
          :options="assetsOpt" />
    </div>
    <div v-else >

    </div>

    <q-btn
      color="primary"
      @click="close"
      :label="label.close"
    />
  </q-modal>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { QField, QInput } from 'quasar'
import VueQr from 'vue-qr'

export default {
  name: 'DepositPanel',
  props: ['user', 'assets', 'asset', 'show', 'haveAdd'],
  components: { QField, QInput },
  data() {
    return {
      currency: ''
    }
  },
  computed: {
    secondSignature() {
      return this.user.account.secondSignature
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
      return this.assetsMap[this.currency].address
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