import fs from "fs/promises";
import path from "path";
import { Videojuego } from "./videojuego.js";
import { error } from "console";

export class UserCollection {
  private userPath: string;

  constructor(private userName: string) {
    this.userPath = path.join("./data", this.userName);
  }

  private async ensureDirectory(): Promise<void> {
    try {
      await fs.access(this.userPath);
    } catch {
      await fs.mkdir(this.userPath, { recursive: true });
    }
  }

  async addGame(juego: Videojuego): Promise<void> {
    await this.ensureDirectory();
    const filePath = path.join(this.userPath, `${juego.id}.json`);
    try {
      await fs.access(filePath);
      throw new Error(
        `Ya existe un juego con ID ${juego.id} para el usuario ${this.userName}`,
      );
    } catch (error: any) {
      if (error.code === "ENOENT") {
        await fs.writeFile(filePath, JSON.stringify(juego, null, 2));
      } else {
        throw error;
      }
    }
  }

  async get(id: string): Promise<Videojuego> {
    await this.ensureDirectory();
    const filePath = path.join(this.userPath, `${id}.json`);

    try {
      const data = await fs.readFile(filePath, "utf-8");
      const parseData = JSON.parse(data);
      const game = new Videojuego(
        parseData.id,
        parseData.nombre,
        parseData.descripcion,
        parseData.plataforma,
        parseData.genero,
        parseData.desarrolladora,
        parseData.lanzamiento,
        parseData.multijugador,
        parseData.horasEstimadas,
        parseData.valor,
      );
      return game;
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Error(`No existe un juego con id ${id}`);
      }
      throw error;
    }
  }

  async update(juego: Videojuego): Promise<void> {
    await this.ensureDirectory();
    const filePath = path.join(this.userPath, `${juego}.json`);

    try {
      await fs.access(filePath);
      await fs.writeFile(filePath, JSON.stringify(juego, null, 2));
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Error(`No existe juego con id ${juego.id}`);
      }
      throw error;
    }
  }

  async removeGame(id: string): Promise<void> {
    await this.ensureDirectory();
    const filePath = path.join(this.userPath, `${id}.json`);
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Error(`No existe juego con el ID ${id}`);
      }
      throw error;
    }
  }

  async showVideogame(id: string): Promise<Videojuego> {
    await this.ensureDirectory();
    const filePath = path.join(this.userPath, `${id}.json`);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const parseData = JSON.parse(data);
      return new Videojuego(
        parseData.id,
        parseData.nombre,
        parseData.descripcion,
        parseData.plataforma,
        parseData.genero,
        parseData.desarrolladora,
        parseData.lanzamiento,
        parseData.multijugador,
        parseData.horasEstimadas,
        parseData.valor,
      );
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Error(`No existe juego con ID ${id}`);
      }
      throw error;
    }
  }

  async listVideogame(): Promise<Videojuego[]> {
    await this.ensureDirectory();
    try {
      const files = await fs.readdir(this.userPath);
      const games: Videojuego[] = [];
      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const data = await fs.readFile(
              path.join(this.userPath, file),
              "utf8",
            );
            const parseData = JSON.parse(data);
            const game = new Videojuego(
              parseData.id,
              parseData.nombre,
              parseData.descripcion,
              parseData.plataforma,
              parseData.genero,
              parseData.desarrolladora,
              parseData.lanzamiento,
              parseData.multijugador,
              parseData.horasEstimadas,
              parseData.valor,
            );
            games.push(game);
          } catch (parseError) {
            console.error(`Error al parsear ${file}`, parseError);
          }
        }
      }
      return games;
    } catch (error: any) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }
}
