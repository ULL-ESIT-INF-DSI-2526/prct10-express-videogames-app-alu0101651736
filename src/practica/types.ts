export type Status = "alive" | "dead" | "unknown";

export interface Character {
  id: number;
  name: string;
  status: Status;
  species: string;
  gender: string;
  episodes: string[];
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
}
