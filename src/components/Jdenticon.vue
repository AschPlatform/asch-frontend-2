<template>
  <canvas :class="address" :width="iconSize" :height="iconSize" :data-jdenticon-value="address"></canvas>
</template>
<script>
import Jdenticon from 'jdenticon'

export default {
  name: 'Jdenticon',
  props: ['address', 'size'],
  data() {
    return {}
  },
  mounted() {
    Jdenticon()
  },
  computed: {
    iconSize() {
      return this.size ? this.size : 30
    }
  },
  watch: {
    address(val) {
      Jdenticon()
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>