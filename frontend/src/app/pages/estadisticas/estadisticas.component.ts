import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ChartPublicacionesUsuarioComponent } from '../../components/charts/chart-publicaciones-usuario/chart-publicaciones-usuario.component';
import { ChartComentariosPublicacionComponent } from '../../components/charts/chart-comentarios-publicacion/chart-comentarios-publicacion.component';

@Component({
  selector: 'app-estadisticas',
  imports: [
    HeaderComponent,
    ChartPublicacionesUsuarioComponent,
    ChartComentariosPublicacionComponent,
  ],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css',
})
export class EstadisticasComponent {}
