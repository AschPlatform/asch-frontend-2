<template>
 <q-card-separator class="separator-line" />
</template>

<script>
import { QCardSeparator } from 'quasar'

export default {
  name: 'BoundaryLine',
  components: { QCardSeparator },
  mounted() {},
  data() {
    return {
      data: {}
    }
  },
  methods: {},
  computed: {}
}
</script>

<style lang="stylus" scoped>
.separator-line {
  width: 100%;
  height: 1px;
  background: #DDDDDD;
}
</style>