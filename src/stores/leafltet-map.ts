import type { LMapComp } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLeafletMapStore = defineStore('leaflet-map', () => {
  const leafletMap = ref<LMapComp | null>(null);

  const setLeafletMap = (currentMap: LMapComp) => {
    leafletMap.value = currentMap;
  };

  return {
    leafletMap,
    setLeafletMap,
  };
});
