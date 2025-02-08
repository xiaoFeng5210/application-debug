<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';

onMounted((() => {
  // 禁用双指缩放
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
  });

  // 禁用双击缩放
  document.addEventListener('dblclick', function (event) {
    event.preventDefault();
  });

  // 防止 iOS 上双指缩放
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if ((now - lastTouchEnd) <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
}))
onUnmounted(() => {
  if (timer) {
    clearInterval(timer as any)
    timer = null
  }
})
</script>

<template>
  <router-view />
</template>
