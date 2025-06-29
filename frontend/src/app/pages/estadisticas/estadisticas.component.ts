import { Component, inject, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-estadisticas',
  imports: [HeaderComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css',
})
export class EstadisticasComponent implements OnInit {
  estadisticasService = inject(EstadisticasService);

  async ngOnInit() {
    //
  }
}
