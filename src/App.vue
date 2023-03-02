<script setup>
import Camera from './components/camera/camera.vue';
import HelloWorld from './components/HelloWorld.vue'

const testMsg = "ddad";
</script>

<template>
  <Camera></Camera>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
