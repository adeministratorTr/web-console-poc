export type TLocation = {
  latitude: number;
  longitude: number;
};

export function getDistanceFromLocations({
  location1,
  location2
}: {
  location1: TLocation;
  location2: TLocation;
}): number {
  const x = location2.longitude - location1.longitude;
  const y = location2.latitude - location1.latitude;
  const difference = Math.sqrt(x * x + y * y);
  return +difference.toFixed(4); // discussable, updatable according to needs
}
