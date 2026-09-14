import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EstadoInterfaz {
  avatarUrl = signal<string | null>(null);
  nombreUsuario = signal<string>('');

  establecerPerfil(nombreUsuario: string, avatarUrl: string | null) {
    this.nombreUsuario.set(nombreUsuario);
    this.avatarUrl.set(avatarUrl);
  }

  limpiar() {
    this.avatarUrl.set(null);
    this.nombreUsuario.set('');
  }
}