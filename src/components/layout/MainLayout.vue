<script setup lang="ts">
import polygons from '@/data/polygons.json';
import { onMounted } from 'vue';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar.vue';
import { usePlacesStore } from '@/stores';
const { loadPolygons } = usePlacesStore();

onMounted(async () => {
  await loadPolygons(polygons);
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full relative z-1">
      <SidebarTrigger class="absolute top-26 left-3 z-4 backgrou bg-white h-8 w-8 cursor-pointer" />
      <RouterView />
    </main>
  </SidebarProvider>
</template>
