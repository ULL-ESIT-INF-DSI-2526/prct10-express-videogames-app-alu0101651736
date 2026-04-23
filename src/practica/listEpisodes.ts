import { findCharacter } from "./findCharacter.js";
import { Episode, Character } from "./types.js";

const BASE_URL = "https://rickandmortyapi.com/api";

/**
 * Funcion que busca los datos de los episodios especificados
 * @param episodeIDs vector con los IDs de los episodios a buscar
 * @returns el nombre y fecha de transmision de los episodios
 */
export async function listEpisodes(
  episodeIDs: number[],
): Promise<{ name: string; air_date: string }[]> {
  if (!episodeIDs.length) {
    throw new Error(`No episode IDs provided`);
  }
  const ids = episodeIDs.join(",");
  const url = `${BASE_URL}/episode/${ids}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Request failed`);
  }

  const data = await res.json();
  const episodes: Episode[] = Array.isArray(data) ? data : [data];

  if (episodes.length !== episodeIDs.length) {
    throw new Error(`Missing episodes`);
  }

  return episodes.map((ep) => ({
    name: ep.name,
    air_date: ep.air_date,
  }));
}
