export interface Location {
  from_time: Date;
  to_time: Date;
}

export interface EpisodeData {
  code: string;
  locations: Location[];
}
