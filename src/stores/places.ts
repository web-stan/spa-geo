import { fetchPlaceGeoJson } from '@/services/nominatimService';
import { defineStore } from 'pinia';
import type { PlacesStore, Place, PlaceCard, PolygonApi, GeoJson } from '@/types';
import type { LatLngExpression } from 'leaflet';
import { useMapControl } from '@/composables';
import router from '@/router';

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

        // this.isLoading = false;
        await this.loadPlacesFromPolygons(data);
      } catch (error) {
        console.error(error);
        //redirect...
      } finally {
        this.isLoading = false;

        if (!this.places.length) {
          router.push({ name: 'NotFound' });
        }
      }
    },
    async loadPlacesFromPolygons(polygons: PolygonApi[], batchSize: number = 10) {
      const allCenters = [];

      for (const poly of polygons) {
        //getting polygon center @turf/center
        try {
          const { getPolygonCenter } = await import('@/utils/polygonCenter');
          allCenters.push(getPolygonCenter(poly.polygon));
        } catch {
          continue;
        }
      }

      //getting info about place API Nominatim
      const { fetchPlaceFromNominatim } = await import('@/services/nominatimService');

      for (let i = 0; i < allCenters.length; i += batchSize) {
        const batch = allCenters.slice(i, i + batchSize);

        const batchResults = await Promise.all(
          batch.map((center, centerIdex) =>
            fetchPlaceFromNominatim<Place>(center.lat!, center.lon!, polygons[centerIdex]!),
          ),
        );

        this.places.push(...JSON.parse(JSON.stringify(batchResults)));

        if (this.places.length === batchSize) {
          this.isLoading = false;
        }
      }

      //focusing the map on the first load on all markers
      if (!this.selectedPlace) {
        const { fitMapToAllMarkers } = useMapControl();
        fitMapToAllMarkers();
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
