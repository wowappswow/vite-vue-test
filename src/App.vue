<script setup>
import navbars from './views/navbars.vue';
</script>

<template>
  <div class="container-fluid p-0">
    <navbars></navbars>
    <div class="container-fluid pt-3">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>

</style>
