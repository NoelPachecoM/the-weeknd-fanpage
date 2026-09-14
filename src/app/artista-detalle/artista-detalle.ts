import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TopService, ArtistaInfo } from '../services/top';
import { ReproductorService } from '../services/reproductor';

@Component({
  selector: 'app-artista-detalle',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './artista-detalle.html',
  styleUrl: './artista-detalle.css'
})
export class ArtistaDetalle implements OnInit {
  info = signal<ArtistaInfo | null>(null);
  cargando = signal(true);
  nombreUsuario = '';
  nombreArtista = '';

  constructor(
    private route: ActivatedRoute,
    private topService: TopService,
    public reproductorService: ReproductorService
  ) {}

  ngOnInit() {
    this.nombreArtista = this.route.snapshot.paramMap.get('nombre') ?? '';
    this.nombreUsuario = this.route.snapshot.paramMap.get('usuario') ?? '';

    this.topService.obtenerArtistaInfo(this.nombreArtista, this.nombreUsuario).subscribe({
      next: (datos) => { this.cargando.set(false); this.info.set(datos); },
      error: () => this.cargando.set(false)
    });
  }

  reproducir(nombreCancion: string) {
    this.reproductorService.reproducir(nombreCancion, this.info()?.nombre ?? this.nombreArtista);
  }
}