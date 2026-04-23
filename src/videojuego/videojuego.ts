import { Plataforma, Genero } from "./types.js";

export class Videojuego {
  constructor(
    private readonly _id: string,
    private _nombre: string,
    private _descripcion: string,
    private _plataforma: Plataforma,
    private _genero: Genero,
    private _desarrolladora: string,
    private _lanzamiento: number,
    private _multijugador: boolean,
    private _horasEstimadas: number,
    private _valor: number,
  ) {
    if (_lanzamiento <= 0 || _horasEstimadas <= 0 || _valor <= 0) {
      throw new Error("Los valores numericos deben de ser positivos");
    }
  }

  get id(): string {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get descripcion(): string {
    return this._descripcion;
  }

  get genero(): Genero {
    return this._genero;
  }

  get plataforma(): Plataforma {
    return this.plataforma;
  }

  get desarrolladora(): string {
    return this.desarrolladora;
  }

  get lanzamiento(): number {
    return this.lanzamiento;
  }

  get multijugador(): boolean {
    return this._multijugador;
  }

  get horasEstimadas(): number {
    return this._horasEstimadas;
  }

  get valor(): number {
    return this._valor;
  }

  toJSON() {
    return {
      id: this._id,
      nombre: this._nombre,
      descripcion: this._descripcion,
      plataforma: this._plataforma,
      genero: this._genero,
      desarrolladora: this._desarrolladora,
      lanzamiento: this._lanzamiento,
      multijugador: this._multijugador,
      horasEstimadas: this._horasEstimadas,
      valor: this._valor,
    };
  }
}
