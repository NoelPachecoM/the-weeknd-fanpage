import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { PerfilService } from '../services/perfil';
import { PerfilFan } from '../models/perfil-fan';
import { EstadoInterfaz } from '../services/estado-interfaz';

@Component({
  selector: 'app-perfil-detalle',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './perfil-detalle.html',
  styleUrl: './perfil-detalle.css'
})
export class PerfilDetalle implements OnInit, OnDestroy {
  nombreUsuario = '';
  perfil = signal<PerfilFan | null>(null);
  cargandoPerfil = signal(true);

  private suscripcionParametros?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private perfilService: PerfilService,
    private estado: EstadoInterfaz
  ) {}

  ngOnInit() {
    // Nos suscribimos a los cambios de la URL en vez de leerla una sola vez,
    // porque al buscar un usuario distinto mientras ya estás en /perfil/:usuario,
    // Angular reutiliza este mismo componente en lugar de recrearlo desde cero.
    this.suscripcionParametros = this.route.paramMap.subscribe(params => {
      this.nombreUsuario = params.get('usuario') ?? '';
      this.cargarPerfil();
    });
  }

  ngOnDestroy() {
    this.suscripcionParametros?.unsubscribe();
    this.estado.limpiar();
  }

  cargarPerfil() {
    this.cargandoPerfil.set(true);
    this.perfil.set(null);

    this.perfilService.buscarOCrearPerfil(this.nombreUsuario).subscribe({
      next: (datos) => {
        this.cargandoPerfil.set(false);
        if (datos.encontrado) {
          this.perfil.set(datos);
          this.estado.establecerPerfil(datos.nombreUsuarioLastfm, datos.imagenUrl ?? null);
        }
      },
      error: () => this.cargandoPerfil.set(false)
    });
  }
}