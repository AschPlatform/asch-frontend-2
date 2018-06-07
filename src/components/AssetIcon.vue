<template>
    <img :src="assetIcon"  :width="iconSize" :height="iconSize" alt="asset icon">
</template>
<script>
import assetIcon1 from '../assets/asset_icon1.png'
import assetIcon2 from '../assets/asset_icon2.png'
import assetIcon3 from '../assets/asset_icon3.png'
import assetIcon4 from '../assets/asset_icon4.png'
import assetIcon5 from '../assets/asset_icon5.png'
import assetIcon6 from '../assets/asset_icon6.png'
import assetIcon7 from '../assets/asset_icon7.png'
import assetIcon8 from '../assets/asset_icon8.png'
import assetIcon9 from '../assets/asset_icon9.png'
import assetIcon10 from '../assets/asset_icon10.png'

export default {
  name: 'AssetIcon',

  props: ['iconKey', 'size'],

  components: {},

  data() {
    return {
      assetIcon1,
      assetIcon2,
      assetIcon3,
      assetIcon4,
      assetIcon5,
      assetIcon6,
      assetIcon7,
      assetIcon8,
      assetIcon9,
      assetIcon10,
      key: 2
    }
  },

  methods: {},

  computed: {
    assetIcon() {
      let iconArray = [
        assetIcon1,
        assetIcon2,
        assetIcon3,
        assetIcon4,
        assetIcon5,
        assetIcon6,
        assetIcon7,
        assetIcon8,
        assetIcon9,
        assetIcon10
      ]
      // this.key = this.iconKey + 1
      return iconArray[this.key]
    },
    iconSize() {
      return this.size ? this.size : '20'
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>