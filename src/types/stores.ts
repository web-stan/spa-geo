import type { Place, GeoJson } from './geoTypes';
import type { LMap } from '@vue-leaflet/vue-leaflet';

export type PlacesStore = {
  places: Place[];
  isLoading: boolean;
  selectedPlace: null | Place;
  selectedGeoJson: null | GeoJson;
};

export type LMapComp = InstanceType<typeof LMap>;
