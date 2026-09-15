import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TopService, ArtistaInfo } from '../services/top';
import { ReproductorService } from '../services/reproductor';

@Component({
  selector: 'app-artista-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './artista-detalle.html',
  styleUrl: './artista-detalle.css'
})
export class ArtistaDetalle implements OnInit, OnDestroy {
  info = signal<ArtistaInfo | null>(null);
  cargando = signal(true);
  nombreUsuario = '';
  nombreArtista = '';

  private suscripcionParametros?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private topService: TopService,
    public reproductorService: ReproductorService
  ) {}

  ngOnInit() {
    // Nos suscribimos a los cambios de la URL en vez de leerla una sola vez,
    // porque al ir de un artista a otro similar, Angular reutiliza este
    // mismo componente en lugar de recrearlo desde cero.
    this.suscripcionParametros = this.route.paramMap.subscribe(params => {
      this.nombreArtista = params.get('nombre') ?? '';
      this.nombreUsuario = params.get('usuario') ?? '';
      this.cargarArtista();
    });
  }

  ngOnDestroy() {
    this.suscripcionParametros?.unsubscribe();
  }

  private cargarArtista() {
    this.cargando.set(true);
    this.info.set(null);

    this.topService.obtenerArtistaInfo(this.nombreArtista, this.nombreUsuario).subscribe({
      next: (datos) => { this.cargando.set(false); this.info.set(datos); },
      error: () => this.cargando.set(false)
    });
  }

  reproducir(nombreCancion: string) {
    this.reproductorService.reproducir(nombreCancion, this.info()?.nombre ?? this.nombreArtista);
  }
}