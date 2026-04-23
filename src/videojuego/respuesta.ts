import { Videojuego } from "./videojuego.js";

export type ApiResponse = {
  success: boolean;
  message?: string;
  videojuego?: Videojuego[];
}