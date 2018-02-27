<template>
  <div></div>
</template>

<script>
export default {
  props: ['userObj'],
  data() {
    return {
      type: -1
    }
  },
  mounted() {
    console.log(this.$route)
  },
  computed: {
    user() {
      return this.userObj
    },
    editType() {
      return this.$toute.name === 'addACL' ? 1 : 0 // 1 add ACL; 0 reduce ACL
    }
  }
}
</script>

<style>

</style>
