import type { Place, PolygonApi } from '@/types';
const baseUrl = import.meta.env.VITE_NOMINATIM_BASE_URL;

export async function fetchPlaceFromNominatim<T>(
  lat: number,
  lon: number,
  poly: PolygonApi,
): Promise<T> {
  const url = `${baseUrl}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    id: poly.id,
    name: poly.name,
    placeName: data.address?.village || data.display_name.split(',')[0] || 'Невідомо',
    lat,
    lon,
    placeInfo: data,
  } as T;
}

export async function fetchPlaceGeoJson<T>(selectedPlace: Place): Promise<T> {
  const { placeInfo } = selectedPlace;

  const PREFIX = placeInfo.osm_type === 'relation' ? 'R' : placeInfo.osm_type === 'way' ? 'W' : 'N';

  const lookupUrl = `${baseUrl}/lookup?osm_ids=${PREFIX}${placeInfo.osm_id}&format=json&polygon_geojson=1`;

  const lookupRes = await fetch(lookupUrl);
  const lookupData = await lookupRes.json();
  const [fullPolygonData] = lookupData;

  const geojsonCoordinates = JSON.parse(JSON.stringify(fullPolygonData.geojson));
  return {
    type: 'Feature',
    geometry: { ...geojsonCoordinates },
    properties: {},
  } as T;
}
