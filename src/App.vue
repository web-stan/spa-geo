<script setup lang="ts">
import { onErrorCaptured } from 'vue';
import { usePlacesStore } from '@/stores';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { storeToRefs } from 'pinia';
const { isLoading } = storeToRefs(usePlacesStore());

onErrorCaptured((error) => {
  console.log('error:', error);
});
</script>

<template>
  <LoadingOverlay :show="isLoading" />
  <RouterView />
</template>
