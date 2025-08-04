<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { LMap, LTileLayer, LMarker, LPopup, LGeoJson } from '@vue-leaflet/vue-leaflet';
import { usePlacesStore } from '@/stores';
import { useMarkerFocus } from '@/composables';

const placeStore = usePlacesStore();
const { places, selectedGeoJson } = storeToRefs(placeStore);
const { mapRef, markerFocus } = useMarkerFocus();

const zoom = ref(6);
const center = ref<[number, number]>([48.5, 31]);
</script>

<template>
  <div style="height: 100vh; width: 100%">
    <LMap
      ref="mapRef"
      :zoom="zoom"
      :center="center"
      class="relative z-1">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors" />
      <!-- Markers -->
      <LMarker
        v-for="place in places"
        :key="place.placeName"
        :lat-lng="[place.lat, place.lon]"
        @click="markerFocus(place)">
        <LPopup>{{ place.placeName }}</LPopup>
      </LMarker>
      <!-- circuit from GeoJSON -->
      <LGeoJson
        v-if="selectedGeoJson"
        :geojson="selectedGeoJson"
        :options-style="() => ({ color: 'blue', weight: 1 })" />
    </LMap>
  </div>
</template>
