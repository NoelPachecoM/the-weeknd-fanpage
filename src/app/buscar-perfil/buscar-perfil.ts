import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfilService } from '../services/perfil';

@Component({
  selector: 'app-buscar-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './buscar-perfil.html',
  styleUrl: './buscar-perfil.css'
})
export class BuscarPerfil {
  nombreUsuario = '';
  cargando = signal(false);
  error = signal('');

  constructor(private perfilService: PerfilService, private router: Router) {}

  buscar() {
    if (!this.nombreUsuario.trim()) return;

    this.cargando.set(true);
    this.error.set('');

    this.perfilService.buscarOCrearPerfil(this.nombreUsuario).subscribe({
      next: (datos) => {
        this.cargando.set(false);
        if (!datos.encontrado) {
          this.error.set('Ese usuario no existe en Last.fm');
        } else {
          this.router.navigate(['/perfil', this.nombreUsuario]);
        }
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Hubo un problema al buscar el perfil');
      }
    });
  }
}