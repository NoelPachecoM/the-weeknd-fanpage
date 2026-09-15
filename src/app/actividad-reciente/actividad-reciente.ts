import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopService, ItemReciente } from '../services/top';
import { ReproductorService } from '../services/reproductor';

@Component({
  selector: 'app-actividad-reciente',
  standalone: true,
  templateUrl: './actividad-reciente.html',
  styleUrl: './actividad-reciente.css'
})
export class ActividadReciente implements OnInit, OnDestroy {
  nombreUsuario = '';
  items = signal<ItemReciente[]>([]);
  cargando = signal(true);
  error = signal(false);

  ahora = signal(Date.now());

  private intervaloReloj?: ReturnType<typeof setInterval>;
  private intervaloRecarga?: ReturnType<typeof setInterval>;
  private manejadorVisibilidad = () => this.alCambiarVisibilidad();

  constructor(
    private route: ActivatedRoute,
    private topService: TopService,
    private reproductorService: ReproductorService
  ) {}

  ngOnInit() {
    this.nombreUsuario = this.route.snapshot.paramMap.get('usuario') ?? '';
    this.cargar();

    this.intervaloReloj = setInterval(() => this.ahora.set(Date.now()), 15000);

    // Solo recargamos en automático mientras la pestaña esté realmente visible.
    if (!document.hidden) {
      this.iniciarIntervaloRecarga();
    }
    document.addEventListener('visibilitychange', this.manejadorVisibilidad);
  }

  ngOnDestroy() {
    clearInterval(this.intervaloReloj);
    this.detenerIntervaloRecarga();
    document.removeEventListener('visibilitychange', this.manejadorVisibilidad);
  }

  private alCambiarVisibilidad() {
    if (document.hidden) {
      // La pestaña quedó en segundo plano: dejamos de gastar peticiones.
      this.detenerIntervaloRecarga();
    } else {
      // La persona volvió a ver la pestaña: recargamos ya mismo y retomamos el intervalo.
      this.cargar(false);
      this.iniciarIntervaloRecarga();
    }
  }

  private iniciarIntervaloRecarga() {
    if (this.intervaloRecarga) return; // ya estaba corriendo, no duplicar
    this.intervaloRecarga = setInterval(() => this.cargar(false), 30000);
  }

  private detenerIntervaloRecarga() {
    clearInterval(this.intervaloRecarga);
    this.intervaloRecarga = undefined;
  }

  cargar(mostrarCargando: boolean = true) {
    if (mostrarCargando) this.cargando.set(true);
    this.topService.obtenerRecientes(this.nombreUsuario).subscribe({
      next: (datos) => {
        this.cargando.set(false);
        if (!datos.error) {
          this.items.set(datos.items);
          this.error.set(false);
        } else {
          this.error.set(true);
        }
      },
      error: () => {
        this.cargando.set(false);
        this.error.set(true);
      }
    });
  }

  tiempoRelativo(fecha: number | null): string {
    if (!fecha) return '';
    const diffMs = this.ahora() - fecha;
    const minutos = Math.floor(diffMs / 60000);

    if (minutos < 1) return 'justo ahora';
    if (minutos < 60) return `hace ${minutos} minuto${minutos === 1 ? '' : 's'}`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas} hora${horas === 1 ? '' : 's'}`;

    const dias = Math.floor(horas / 24);
    return `hace ${dias} día${dias === 1 ? '' : 's'}`;
  }

  identificarFila(item: ItemReciente, indice: number): string {
    return `${item.fecha ?? 'ahora'}-${item.nombre}-${indice}`;
  }

  reproducir(item: ItemReciente, evento: Event) {
    evento.stopPropagation();
    this.reproductorService.reproducir(item.nombre, item.artista);
  }
}