<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    personal
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    debugger
    console.log(this.$route.params.user)
  }
}
</script>

<style>

</style>
