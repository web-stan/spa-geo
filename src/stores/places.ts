import { fetchPlaceGeoJson } from '@/services/nominatimService';
import { defineStore } from 'pinia';
import type { PlacesStore, Place, PlaceCard, PolygonApi, GeoJson } from '@/types';
import type { LatLngExpression } from 'leaflet';
import { useMapControl } from '@/composables';
import { useRouter } from 'vue-router';

export const usePlacesStore = defineStore('places', {
  state: (): PlacesStore => ({
    places: [],
    isLoading: false,
    selectedPlace: null,
    selectedGeoJson: null,
  }),

  actions: {
    async loadPolygons(polygons: PolygonApi[]) {
      if (this.isLoading) return;
      if (this.places.length) return;

      try {
        this.isLoading = true;

        // API request simulation
        const data = await new Promise<PolygonApi[]>((resolve) =>
          setTimeout(resolve, 1500, polygons),
        );

        this.isLoading = false;
        await this.loadPlacesFromPolygons(data);
      } catch (error) {
        console.error(error);
        const router = useRouter();
        router.push({ name: 'NotFound' });
        //redirect...
      } finally {
        this.isLoading = false;
      }
    },
    async loadPlacesFromPolygons(polygons: PolygonApi[]) {
      for (const poly of polygons) {
        //getting polygon center @turf/center
        let center = null;
        try {
          const { getPolygonCenter } = await import('@/utils/polygonCenter');
          center = getPolygonCenter(poly.polygon);
        } catch {
          continue;
        }

        //getting info about place API Nominatim
        let place = null;
        try {
          const { fetchPlaceFromNominatim } = await import('@/services/nominatimService');
          place = await fetchPlaceFromNominatim<Place>(center.lat!, center.lon!, poly);
          this.places.push(place);
        } catch (error) {
          console.error(error);
          continue;
        }
      }

      //focusing the map on the first load on all markers
      if (!this.selectedPlace) {
        const { fitMapToAllMarkers } = useMapControl();
        fitMapToAllMarkers();
      }

      if (this.places.length === 0) {
        const router = useRouter();
        //redirect...
        router.push({ name: 'NotFound' });
      }
    },
    selectPlace(place: Place) {
      this.selectedPlace = place;
    },
    async loadPlaceGeoJson(placeName: string) {
      if (this.isLoading) return;

      this.isLoading = true;
      try {
        const result = await fetchPlaceGeoJson<GeoJson>(this.selectedPlace!);

        if ('geometry' in result) {
          this.selectedGeoJson = result;
        } else {
          this.selectedGeoJson = null;
          console.warn(`GeoJSON не знайден для: ${placeName}`);
        }
      } catch (e) {
        console.error('Помилка при отриманні GeoJSON:', e);
      } finally {
        this.isLoading = false;
      }
    },
    clearSelection() {
      this.selectedPlace = null;
      this.selectedGeoJson = null;
    },
  },
  getters: {
    coordinateBounds: (state): LatLngExpression[] => state.places.map((p) => [p.lat, p.lon]),
    selectedPlaceInfoCard: (state): PlaceCard | null => {
      if (state.selectedPlace) {
        return {
          placeName: state.selectedPlace.placeName,
          state: state.selectedPlace.placeInfo.address.state,
          country: state.selectedPlace.placeInfo.address.country,
          district: state.selectedPlace.placeInfo.address.district,
          municipality: state.selectedPlace.placeInfo.address.municipality,
          // licence: state.selectedPlace.placeInfo.licence
        };
      }
      return null;
    },
    isMarkerSelected: (state): boolean => !!state.selectedGeoJson,
  },
});
