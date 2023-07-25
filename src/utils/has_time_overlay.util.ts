import { Location } from 'src/modules/character/interface/episode_data';

export function hasTimeOverlap(
  location1: Location,
  location2: Location,
): boolean {
  const from1 = location1.from_time.getTime();
  const to1 = location1.to_time.getTime();
  const from2 = location2.from_time.getTime();
  const to2 = location2.to_time.getTime();

  return !(from1 >= to2 || to1 <= from2);
}
