import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PerfilService } from '../services/perfil';
import { PerfilFan } from '../models/perfil-fan';
import { EstadoInterfaz } from '../services/estado-interfaz';
import { ReproductorService } from '../services/reproductor';
import { Reproductor } from '../reproductor/reproductor';

@Component({
  selector: 'app-perfil-detalle',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterLinkActive, RouterOutlet, Reproductor],
  templateUrl: './perfil-detalle.html',
  styleUrl: './perfil-detalle.css'
})
export class PerfilDetalle implements OnInit, OnDestroy {
  nombreUsuario = '';
  perfil = signal<PerfilFan | null>(null);
  cargandoPerfil = signal(true);

  constructor(
    private route: ActivatedRoute,
    private perfilService: PerfilService,
    private estado: EstadoInterfaz,
    public reproductorService: ReproductorService
  ) {}

  ngOnDestroy() {
    this.estado.limpiar();
    this.reproductorService.cerrar();
  }

  ngOnInit() {
    this.nombreUsuario = this.route.snapshot.paramMap.get('usuario') ?? '';
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.cargandoPerfil.set(true);
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