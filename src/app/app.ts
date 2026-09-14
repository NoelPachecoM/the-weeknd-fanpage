import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecera } from './cabecera/cabecera';

@Component({
  imports: [RouterOutlet, Cabecera],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('spotify');
}