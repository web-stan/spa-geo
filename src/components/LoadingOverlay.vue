<template>
  <div
    v-if="show"
    class="overlay">
    <div class="spinner">Завантаження...</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>();
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: none;
}
.spinner {
  padding: 1rem 2rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-weight: bold;
}
</style>
