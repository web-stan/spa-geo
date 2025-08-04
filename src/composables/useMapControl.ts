import { latLngBounds } from 'leaflet';
import { storeToRefs } from 'pinia';
import { useLeafletMapStore, usePlacesStore } from '@/stores';

export const useMapControl = () => {
  const { coordinateBounds } = storeToRefs(usePlacesStore());
  const { leafletMap } = storeToRefs(useLeafletMapStore());

  function fitMapToAllMarkers() {
    if (!leafletMap.value?.leafletObject) {
      return;
    }

    const bounds = latLngBounds(coordinateBounds.value);

    leafletMap.value.leafletObject.flyToBounds(bounds, { padding: [20, 20], duration: 2 });
  }

  return {
    fitMapToAllMarkers,
  };
};
