<template>
    <img :src="assetIcon"  :width="iconSize" :height="iconSize" alt="asset icon">
</template>
<script>
import xas from '../assets/xas.png'
import xasChainAssets from '../assets/xas_chain_assets.png'
import withdraw from '../assets/withdraw.png'
import transfer from '../assets/transfer.png'
import receipt from '../assets/receipt.png'
import pay from '../assets/pay.png'
import fee from '../assets/fee.png'
import bch from '../assets/bch.png'
import btc from '../assets/btc.png'
import chainTransfer from '../assets/chain_transfer.png'

export default {
  name: 'AssetIcon',

  props: ['iconKey', 'size'],

  components: {},

  data() {
    return {
      xas,
      xasChainAssets,
      withdraw,
      transfer,
      receipt,
      pay,
      fee,
      bch,
      btc,
      chainTransfer
    }
  },

  methods: {},

  computed: {
    assetIcon() {
      let icons = {
        'XAS': xas,
        'WITHINCHAINASSET': xasChainAssets,
        'WITHDRAW': withdraw,
        'TRANSFER': transfer,
        'RECEIPT': receipt,
        'PAY': pay,
        'FEE': fee,
        'BCH': bch,
        'BTC': btc,
        'CHAINTRANSFER': chainTransfer
      }
      return icons.XAS
    },
    iconSize() {
      return this.size ? this.size : '20'
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>