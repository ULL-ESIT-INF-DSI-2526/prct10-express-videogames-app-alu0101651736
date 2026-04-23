import { Character, Status } from "./types.js";

const BASE_URL = "https://rickandmortyapi.com/api";

/**
 * Funcion que busca personajes que cumplan los filtros
 * @param name filtro de nombre
 * @param gender filtro de genero
 * @param species filtro de especie
 * @param status filtro de estado
 * @returns un vector con los personajes que pasen el filtro
 */
export async function findCharacter(
  name?: string,
  gender?: string,
  species?: string,
  status?: Status,
): Promise<Character[]> {
  if (!(name || gender || species || status)) {
    throw new Error(`A filter must be applied`);
  }

  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (gender) params.append("gender", gender);
  if (species) params.append("species", species);
  if (status) params.append("status", status);
  const url = `${BASE_URL}/character/?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Request failed`);
  }

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`No characters found`);
  }

  let allResults = [...data.results];

  let nextUrl = data.info?.next;

  // Searches multiple pages
  while (nextUrl) {
    const nextRes = await fetch(nextUrl);
    if (!nextRes.ok) {
      throw new Error(`Request failed`);
    }
    const nextData = await nextRes.json();
    allResults = [...allResults, ...nextData.results];
    nextUrl = nextData.info?.next;
    data.info = nextData.info;
  }

  return allResults;
}
