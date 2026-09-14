import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReproductorService } from '../services/reproductor';

@Component({
  selector: 'app-reproductor',
  standalone: true,
  imports: [],
  templateUrl: './reproductor.html',
  styleUrl: './reproductor.css'
})
export class Reproductor {
  constructor(public reproductorService: ReproductorService, private sanitizer: DomSanitizer) {}

  urlSegura(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
  }
}