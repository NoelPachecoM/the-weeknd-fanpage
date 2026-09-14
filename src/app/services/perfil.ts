import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilFan } from '../models/perfil-fan';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private urlBase = '/api/perfil';

  constructor(private http: HttpClient) {}

  buscarOCrearPerfil(nombreUsuario: string): Observable<PerfilFan> {
    return this.http.get<PerfilFan>(`${this.urlBase}?usuario=${nombreUsuario}`);
  }
}