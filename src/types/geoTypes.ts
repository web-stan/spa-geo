import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
// import type { Feature, Polygon, MultiPolygon, GeoJsonObject } from 'geojson';

export type GeoJson = Feature<Geometry, GeoJsonProperties>;

export type Place = {
  id: number | string;
  name: string;
  placeName: string;
  lat: number;
  lon: number;
  placeInfo: PlaceInfo;
};

export type PlaceInfo = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox: string[];
};

export type Address = {
  municipality: string;
  district: string;
  state?: string | undefined;
  'ISO3166-2-lvl4'?: string;
  country: string;
  country_code: string;
  postcode?: number;
  village?: string;
};

export type PolygonApi = {
  id: number;
  name: string;
  polygon: PolygonPosition[];
};

type PolygonPosition = {
  lat: number;
  lng: number;
};
