<template>
 <img :src="getTokenIcon" alt="">
</template>

<script>
import XAS from '../assets/xas.png'
import BTC from '../assets/btc.png'
import BCH from '../assets/bch.png'

export default {
  name: 'TokenIcon',
  props: ['tokenIcon'],
  components: {},
  mounted() {},
  data() {
    return {
      data: {
        XAS,
        BTC,
        BCH
      }
    }
  },
  methods: {},
  computed: {
    getTokenIcon() {
      let tokenStr = {
        XAS: XAS,
        BTC: BTC,
        BCH: BCH
      }
      return tokenStr[this.tokenIcon]
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>