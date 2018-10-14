<template>
  <div class="tip-bar-container">
    <div class="tip-bar-content shadow-1 row" :class="tipColor">
      <i class="material-icons font-20 col-1">
        report_problem
      </i>
      <div class="col-11">
        {{tipContent}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TipBar',
  data() {
    return {}
  },
  // rate: 当前准备金率， name: token名称, status: 1 - 正常  2 - 警告  3 - 停止
  props: ['ratio', 'status', 'symbol'],
  methods: {},
  computed: {
    tipContent() {
      // return 'Curreny problem is not work well'
      switch (this.status) {
        case 1:
          return this.$t('TIP_BAR_NORMAL', {rate: this.ratio})
        case 2:
          return this.$t('TIP_BAR_WARN', {rate: this.ratio, name: this.symbol})
        case 3:
          return this.$t('TIP_BAR_CLOSE')
      }
    },
    tipColor() {
      if (this.status === 1) {
        return 'text-secondary'
      }
      return 'text-negative'
    }
  }
}
</script>

<style lang="stylus" scoped>
.tip-bar-container
  padding: 20px;
.tip-bar-content
  height 70px;
  background: #ffffff !important;
  padding 0 10px;
  border-radius: 3px;
  div
    line-height 30px;
    display inline-block;
  i
    vertical-align middle;

</style>
