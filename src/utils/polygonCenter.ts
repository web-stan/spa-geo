//geting center of the polygon
import center from '@turf/center';
import { polygon as turfPolygon } from '@turf/helpers';

export const getPolygonCenter = (coordinates: { lat: number; lng: number }[]) => {
  const points = coordinates.map((p) => [p.lng, p.lat]);

  const turfPoly = turfPolygon([[...points]]);

  const centerPoint = center(turfPoly);

  const [lon, lat] = centerPoint.geometry.coordinates;
  return { lat, lon };
};
