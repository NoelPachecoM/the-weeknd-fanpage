import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CancionActual {
  nombre: string;
  artista: string;
  videoId: string | null;
  cargando: boolean;
}

@Injectable({ providedIn: 'root' })
export class ReproductorService {
  abierto = signal(false);
  cancionActual = signal<CancionActual | null>(null);

  constructor(private http: HttpClient) {}

  reproducir(nombre: string, artista: string) {
    this.abierto.set(true);
    this.cancionActual.set({ nombre, artista, videoId: null, cargando: true });

    this.http.get<{ error: boolean; videoId: string | null }>(
      `/api/youtube-buscar?artista=${encodeURIComponent(artista)}&cancion=${encodeURIComponent(nombre)}`
    ).subscribe({
      next: (datos) => this.cancionActual.set({ nombre, artista, videoId: datos.videoId, cargando: false }),
      error: () => this.cancionActual.set({ nombre, artista, videoId: null, cargando: false }),
    });
  }

  cerrar() {
    this.abierto.set(false);
    this.cancionActual.set(null);
  }
}