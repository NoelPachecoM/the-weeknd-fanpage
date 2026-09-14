import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TopService, ItemTop } from '../services/top';
import { ReproductorService } from '../services/reproductor';

type TipoSeccion = 'artists' | 'albums' | 'tracks';

interface EstadoSeccion {
  periodo: '7day' | '1month' | '12month' | 'overall';
  estilo: 'grid' | 'lista';
  cantidad: number;
  items: ItemTop[];
  cargando: boolean;
  configuracionAbierta: boolean;
}

function estadoInicial(): EstadoSeccion {
  return { periodo: '7day', estilo: 'grid', cantidad: 10, items: [], cargando: true, configuracionAbierta: false };
}

@Component({
  selector: 'app-top-seccion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './top-seccion.html',
  styleUrl: './top-seccion.css'
})
export class TopSeccion implements OnInit {
  nombreUsuario = '';
  tipo: TipoSeccion = 'artists';
  titulo = '';
  estado = signal<EstadoSeccion>(estadoInicial());

  constructor(
    private route: ActivatedRoute,
    private topService: TopService,
    public reproductorService: ReproductorService
  ) {}

  ngOnInit() {
    this.nombreUsuario = this.route.snapshot.paramMap.get('usuario') ?? '';
    this.tipo = (this.route.snapshot.data['tipo'] as TipoSeccion) ?? 'artists';
    this.titulo = this.tipo === 'artists' ? 'Top Artistas' : this.tipo === 'albums' ? 'Top Álbumes' : 'Top Canciones';
    this.cargar();
  }

  cargar() {
    this.estado.update(s => ({ ...s, cargando: true }));
    this.topService.obtenerTop(this.nombreUsuario, this.tipo, this.estado().periodo, this.estado().cantidad).subscribe({
      next: (datos) => this.estado.update(s => ({ ...s, cargando: false, items: datos.error ? [] : datos.items })),
      error: () => this.estado.update(s => ({ ...s, cargando: false }))
    });
  }

  cambiarPeriodo(periodo: EstadoSeccion['periodo']) {
    this.estado.update(s => ({ ...s, periodo }));
    this.cargar();
  }

  cambiarEstilo(estilo: EstadoSeccion['estilo']) {
    this.estado.update(s => ({ ...s, estilo }));
  }

  cambiarCantidad(cantidad: number) {
    this.estado.update(s => ({ ...s, cantidad }));
    this.cargar();
  }

  alternarConfiguracion() {
    this.estado.update(s => ({ ...s, configuracionAbierta: !s.configuracionAbierta }));
  }

  enlaceItem(item: ItemTop): any[] | null {
    if (this.tipo === 'artists') return ['/perfil', this.nombreUsuario, 'artista', item.nombre];
    if (this.tipo === 'albums') return ['/perfil', this.nombreUsuario, 'album', item.artista ?? '', item.nombre];
    return null;
  }

  reproducir(item: ItemTop, evento: Event) {
    evento.stopPropagation();
    evento.preventDefault();
    this.reproductorService.reproducir(item.nombre, item.artista ?? '');
  }
}