import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TopService, RespuestaExplosion } from '../services/top';

@Component({
  selector: 'app-explosion-pasado',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './explosion-pasado.html',
  styleUrl: './explosion-pasado.css'
})
export class ExplosionPasado implements OnInit {
  nombreUsuario = '';
  explosion = signal<RespuestaExplosion | null>(null);
  cargando = signal(true);

  constructor(private route: ActivatedRoute, private topService: TopService) {}

  ngOnInit() {
    this.nombreUsuario = this.route.snapshot.paramMap.get('usuario') ?? '';
    this.buscar();
  }

  buscar() {
    this.cargando.set(true);
    this.topService.obtenerExplosion(this.nombreUsuario).subscribe({
      next: (datos) => {
        this.cargando.set(false);
        this.explosion.set(datos);
      },
      error: () => {
        this.cargando.set(false);
        this.explosion.set({ error: true, mensaje: 'Hubo un problema al buscar' });
      }
    });
  }
}