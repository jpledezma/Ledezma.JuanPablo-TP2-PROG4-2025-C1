import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EstadisticasService } from '../../../services/estadisticas.service';
import { estilos } from '../chart-style';
import { ChartOptions } from '../chart-types';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chart-comentarios-publicacion',
  imports: [NgApexchartsModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './chart-comentarios-publicacion.component.html',
  styleUrl: './chart-comentarios-publicacion.component.css',
})
export class ChartComentariosPublicacionComponent {
  estilos = estilos;
  estadisticasService = inject(EstadisticasService);
  data: any;
  mostrarChart: boolean = false;
  chartOptions?: Partial<ChartOptions>;

  desde = '';
  hasta = '';
  publicacionId = '';
  enlacePublicacion?: string;

  async buscar() {
    if (!this.desde || !this.hasta || !this.publicacionId) {
      return;
    }

    const fechaDesde = new Date(this.desde).getTime();
    const fechaHasta = new Date(this.hasta).getTime();

    const data = await this.estadisticasService.traercomentariosPorPublicacion(
      this.publicacionId,
      fechaDesde,
      fechaHasta,
    );

    if (data) {
      this.data = data;
      this.cargarDatosEnChart();
      this.mostrarChart = true;
    } else {
      Swal.fire({
        icon: 'error',
        text: 'No se pudieron buscar los datos',
        theme: 'dark',
        width: '50rem',
        customClass: {
          htmlContainer: 'modal-texto',
          confirmButton: 'modal-boton',
        },
      });
    }
  }

  cargarDatosEnChart() {
    const comentariosPorDia = this.agruparPorDia();

    this.chartOptions = {
      series: [
        {
          name: 'Comentarios',
          data: comentariosPorDia.data,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        foreColor: estilos.textColor,
      },
      title: {
        text: 'Comentarios de la publicación',
      },
      xaxis: {
        categories: comentariosPorDia.categories,
        type: 'datetime',
      },
    };

    this.enlacePublicacion = `/publicacion/${this.data._id}`;
  }

  agruparPorDia(): { categories: number[]; data: number[] } {
    const UN_DIA = 86400000;
    const comentariosPorDia = [];

    for (const comentario of this.data.comentarios) {
      const timestamp = Math.floor(comentario.fecha / UN_DIA) * UN_DIA;
      comentariosPorDia.push(timestamp);
    }

    // magia
    const valores: any = {};
    for (const timestamp of comentariosPorDia) {
      if (valores[timestamp] === undefined) {
        valores[timestamp] = 1;
      } else {
        valores[timestamp] += 1;
      }
    }

    const datosSeparados = {
      categories: new Array<number>(),
      data: new Array<number>(),
    };

    for (const key in valores) {
      datosSeparados.categories.push(+key);
      datosSeparados.data.push(valores[key]);
    }

    return datosSeparados;
  }
}
