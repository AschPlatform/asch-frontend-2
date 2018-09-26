<template>
  <div class="tip-bar-container">
    <div class="tip-bar-content shadow-1">
      <i class="material-icons font-20">
        report_problem
      </i>
      {{tipContent}}
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
  props: ['rate', 'name', 'status'],
  methods: {},
  computed: {
    tipContent() {
      // return 'Curreny problem is not work well'
      switch (status) {
        case 1:
          return this.$t('TIP_BAR_NORMAL', {rate: this.rate})
        case 2:
          return this.$t('TIP_BAR_WARN', {rate: this.rate, name: this.name})
        case 3:
          return this.$t('TIP_BAR_CLOSE')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.tip-bar-container
  padding: 20px;
.tip-bar-content
  height 70px;
  line-height 70px;
  background: #ffffff !important;
  padding 0 10px;
  border-radius: 3px;
  i
    vertical-align middle;

</style>
