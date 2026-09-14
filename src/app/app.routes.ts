import { Routes } from '@angular/router';
import { BuscarPerfil } from './buscar-perfil/buscar-perfil';
import { PerfilDetalle } from './perfil-detalle/perfil-detalle';
import { TopSeccion } from './top-seccion/top-seccion';
import { ActividadReciente } from './actividad-reciente/actividad-reciente';
import { ExplosionPasado } from './explosion-pasado/explosion-pasado';
import { ArtistaDetalle } from './artista-detalle/artista-detalle';
import { AlbumDetalle } from './album-detalle/album-detalle';

export const routes: Routes = [
  { path: '', component: BuscarPerfil },
  {
    path: 'perfil/:usuario',
    component: PerfilDetalle,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'artistas' },
      { path: 'artistas', component: TopSeccion, data: { tipo: 'artists' } },
      { path: 'albumes', component: TopSeccion, data: { tipo: 'albums' } },
      { path: 'canciones', component: TopSeccion, data: { tipo: 'tracks' } },
      { path: 'actividad', component: ActividadReciente },
      { path: 'explosion', component: ExplosionPasado },
      { path: 'artista/:nombre', component: ArtistaDetalle },
      { path: 'album/:artista/:album', component: AlbumDetalle },
    ],
  },
];