import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoInterfaz } from '../services/estado-interfaz';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cabecera.html',
  styleUrl: './cabecera.css'
})
export class Cabecera {
  constructor(public estado: EstadoInterfaz) {}
}