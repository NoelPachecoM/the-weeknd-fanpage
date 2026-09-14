import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopService, AlbumInfo } from '../services/top';
import { ReproductorService } from '../services/reproductor';

@Component({
  selector: 'app-album-detalle',
  standalone: true,
  imports: [],
  templateUrl: './album-detalle.html',
  styleUrl: './album-detalle.css'
})
export class AlbumDetalle implements OnInit {
  info = signal<AlbumInfo | null>(null);
  cargando = signal(true);

  constructor(
    private route: ActivatedRoute,
    private topService: TopService,
    public reproductorService: ReproductorService
  ) {}

  ngOnInit() {
    const artista = this.route.snapshot.paramMap.get('artista') ?? '';
    const album = this.route.snapshot.paramMap.get('album') ?? '';
    const usuario = this.route.snapshot.paramMap.get('usuario') ?? '';

    this.topService.obtenerAlbumInfo(artista, album, usuario).subscribe({
      next: (datos) => { this.cargando.set(false); this.info.set(datos); },
      error: () => this.cargando.set(false)
    });
  }

  formatoDuracion(segundos: number | null): string {
    if (!segundos) return '';
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg.toString().padStart(2, '0')}`;
  }

  reproducir(nombreTrack: string) {
    this.reproductorService.reproducir(nombreTrack, this.info()?.artista ?? '');
  }
}