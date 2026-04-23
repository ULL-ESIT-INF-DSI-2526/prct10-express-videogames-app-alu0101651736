import express from "express";
import { Videojuego } from "./videojuego.js";
import { UserCollection } from "./collection.js";
import { Plataforma, Genero } from "./types.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/videogames", async (req, res) => {
  const user = req.query.user as string;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Se requiere el parámetro "user"',
    });
  }

  try {
    const collection = new UserCollection(user);
    const games = await collection.listVideogame();
    return res.json({
      success: true,
      videogames: games,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al leer los videojuegos",
    });
  }
});

app.get("/videogames/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.query.user as string;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Se requiere el parámetro "user"',
    });
  }

  try {
    const collection = new UserCollection(user);
    const game = await collection.showVideogame(id);
    return res.json({
      success: true,
      videogames: game,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/videogames", async (req, res) => {
  const { user, videogames } = req.body;

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Se requiere el campo "user"',
    });
  }
  if (!videogames) {
    return res.status(400).json({
      success: false,
      message: 'Se requiere el campo "videogames"',
    });
  }

  const required = [
    "id",
    "nombre",
    "descripcion",
    "plataforma",
    "genero",
    "desarrolladora",
    "lanzamiento",
    "horasEstimadas",
    "valor",
  ];
  for (const field of required) {
    if (!videogames[field]) {
      return res.status(400).json({
        success: false,
        message: `Falta el campo "${field}" en videogame`,
      });
    }
  }

  if (
    videogames.multijugador === undefined ||
    typeof videogames.multijugador !== "boolean"
  ) {
    return res.status(400).json({
      success: false,
      message: 'El campo "multijugador" es requerido y debe ser true o false',
    });
  }

  try {
    const game = new Videojuego(
      videogames.id,
      videogames.nombre,
      videogames.descripcion,
      videogames.plataforma as Plataforma,
      videogames.genero as Genero,
      videogames.desarrolladora,
      videogames.lanzamiento,
      videogames.multijugador,
      videogames.horasEstimadas,
      videogames.valor,
    );
    const collection = new UserCollection(user);
    await collection.addGame(game);

    return res.status(201).json({
      success: true,
      message: `Juego "${game.nombre}" añadido correctamente`,
      videogames: game,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/videogames/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.query.user as string;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Se requiere el parámetro "user"',
    });
  }

  try {
    const collection = new UserCollection(user);
    await collection.removeGame(id);
    return res.json({
      success: true,
      message: `Videojego con ID ${id} eliminado correctamente`,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Modifica parcial o totalmente un videojuego
 * Ejemplo de uso: PATCH /videogames/:id?user=edusegre
 */
app.patch("/videogames/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.query.user as string;
  const { updates } = req.body;
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Se requiere el parámetro "user"',
    });
  }

  if (!updates) {
    return res.status(400).json({
      success: false,
      message: 'Se requiere el campo "updates" con los datos a modificar',
    });
  }

  try {
    const collection = new UserCollection(user);
    const existingGame = await collection.get(id);
    const updatedGame = new Videojuego(
      updates.id || existingGame.id,
      updates.nombre || existingGame.nombre,
      updates.descripcion || existingGame.descripcion,
      updates.plataforma || existingGame.plataforma,
      updates.genero || existingGame.genero,
      updates.desarrolladora || existingGame.desarrolladora,
      updates.lanzamiento || existingGame.lanzamiento,
      updates.multijugador !== undefined
        ? updates.multijugador
        : existingGame.multijugador,
      updates.horasEstimadas || existingGame.horasEstimadas,
      updates.valor || existingGame.valor,
    );
    await collection.update(updatedGame);
    return res.json({
      success: true,
      message: `Juego con ID ${id} modificado`,
      videogames: updatedGame,
    });
  } catch (error: any) {
    const status = error.message.includes("No existe") ? 404 : 500;
    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
  console.log("\nRutas disponibles:");
  console.log("  GET    /videogames?user=<usuario>");
  console.log("  GET    /videogames/:id?user=<usuario>");
  console.log("  POST   /videogames");
  console.log("  DELETE /videogames/:id?user=<usuario>");
  console.log("  PATCH  /videogames/:id?user=<usuario>");
});

export { app };
