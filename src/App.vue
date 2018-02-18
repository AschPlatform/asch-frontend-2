<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-transition appear enter="fadeIn" leave="fadeOut" mode="out-in" :duration="500">
      <router-view />
    </q-transition>
  
  </div>
</template>

<script>
/*
   * Root component
   */
export default {}
</script>

<style>

</style>
