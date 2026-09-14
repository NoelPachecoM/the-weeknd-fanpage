import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArtistaInfo {
  error: boolean;
  nombre?: string;
  biografia?: string | null;
  oyentes?: string | null;
  scrobblesUsuario?: string | null;
  similares?: { nombre: string; imagen: string | null }[];
  canciones?: { nombre: string; album: string | null; fecha: string | null }[];
  topCanciones?: { nombre: string; reproducciones: number }[];
  mensaje?: string;
}

export interface AlbumInfo {
  error: boolean;
  nombre?: string;
  artista?: string;
  imagen?: string | null;
  resumen?: string | null;
  scrobblesUsuario?: string | null;
  tracks?: { nombre: string; duracionSegundos: number | null }[];
  mensaje?: string;
}

export interface ItemTop {
  nombre: string;
  artista?: string;
  reproducciones: number;
  imagen: string | null;
}

export interface RespuestaTop {
  error: boolean;
  tipo: string;
  periodo: string;
  items: ItemTop[];
  mensaje?: string;
}

export interface SemanaActividad {
  desde: number;
  hasta: number;
  totalScrobbles: number;
  artistaPrincipal: string | null;
}

export interface RespuestaActividad {
  error: boolean;
  semanas: SemanaActividad[];
  mensaje?: string;
}

export interface ItemReciente {
  nombre: string;
  artista: string;
  album: string | null;
  imagen: string | null;
  fecha: number | null;
  reproduciendoAhora: boolean;
}

export interface RespuestaRecientes {
  error: boolean;
  items: ItemReciente[];
  mensaje?: string;
}

export interface ItemExplosion {
  nombre: string;
  artista?: string;
  reproducciones: number;
}

export interface RespuestaExplosion {
  error: boolean;
  desde?: number;
  hasta?: number;
  topArtistas?: ItemExplosion[];
  topCanciones?: ItemExplosion[];
  mensaje?: string;
}

@Injectable({ providedIn: 'root' })
export class TopService {
  constructor(private http: HttpClient) {}

  obtenerTop(usuario: string, tipo: string, periodo: string, limite: number = 10): Observable<RespuestaTop> {
    return this.http.get<RespuestaTop>(`/api/top?usuario=${usuario}&tipo=${tipo}&periodo=${periodo}&limite=${limite}`);
  }

  obtenerActividad(usuario: string): Observable<RespuestaActividad> {
    return this.http.get<RespuestaActividad>(`/api/actividad?usuario=${usuario}`);
  }

  obtenerRecientes(usuario: string, limite: number = 30): Observable<RespuestaRecientes> {
    return this.http.get<RespuestaRecientes>(`/api/recientes?usuario=${usuario}&limite=${limite}`);
  }

  obtenerImagenArtista(nombre: string): Observable<{ error: boolean; imagen: string | null }> {
    return this.http.get<{ error: boolean; imagen: string | null }>(`/api/artista-imagen?nombre=${encodeURIComponent(nombre)}`);
  }

  obtenerExplosion(usuario: string): Observable<RespuestaExplosion> {
    return this.http.get<RespuestaExplosion>(`/api/explosion?usuario=${usuario}`);
  }

  obtenerArtistaInfo(nombre: string, usuario: string): Observable<ArtistaInfo> {
    return this.http.get<ArtistaInfo>(`/api/artista-info?nombre=${encodeURIComponent(nombre)}&usuario=${usuario}`);
  }

  obtenerAlbumInfo(artista: string, album: string, usuario: string): Observable<AlbumInfo> {
    return this.http.get<AlbumInfo>(`/api/album-info?artista=${encodeURIComponent(artista)}&album=${encodeURIComponent(album)}&usuario=${usuario}`);
  }
}