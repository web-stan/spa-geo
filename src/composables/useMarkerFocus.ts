import { onMounted, useTemplateRef, watch } from 'vue';
import { usePlacesStore, useLeafletMapStore } from '@/stores';
import type { GeoJson, LMapComp, Place } from '@/types';
import { geoJSON } from 'leaflet';
import { storeToRefs } from 'pinia';
import { useSidebar } from '@/components/ui/sidebar';

export const useMarkerFocus = () => {
  const { isMobile, toggleSidebar, open } = useSidebar();
  const { selectedGeoJson, selectedPlace } = storeToRefs(usePlacesStore());
  const { selectPlace, loadPlaceGeoJson } = usePlacesStore();
  const leafletMapStore = useLeafletMapStore();

  const mapRef = useTemplateRef<LMapComp | undefined>('mapRef');

  function markerFocus(place: Place) {
    if (selectedPlace.value?.id === place.id) return;

    if (isMobile.value && open.value) {
      toggleSidebar();
    }

    selectPlace(place);
    loadPlaceGeoJson(place.name);
  }

  function getGeoJsonBounds(geojson: GeoJson): L.LatLngBounds | null {
    try {
      return geoJSON(geojson).getBounds();
    } catch (e) {
      console.error('Помилка при обчисленні кордонів:', e);
      return null;
    }
  }

  watch(selectedGeoJson, (currentlySelected) => {
    if (!currentlySelected || !mapRef.value) return;

    const bounds = getGeoJsonBounds(currentlySelected);
    if (bounds && mapRef.value) {
      mapRef.value.leafletObject?.flyToBounds(bounds, { duration: 2 });
    }
  });

  onMounted(() => {
    if (mapRef.value) {
      leafletMapStore.setLeafletMap(mapRef.value);
    }
  });

  return {
    mapRef,
    markerFocus,
  };
};
