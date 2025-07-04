import { Component, inject } from '@angular/core';
import { EstadisticasService } from '../../../services/estadisticas.service';
import { estilos } from '../chart-style';
import { ChartOptions } from '../chart-types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chart-comentarios',
  imports: [NgApexchartsModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chart-comentarios.component.html',
  styleUrl: './chart-comentarios.component.css',
})
export class ChartComentariosComponent {
  estilos = estilos;
  estadisticasService = inject(EstadisticasService);
  data: any;
  mostrarChart: boolean = false;
  chartOptions?: Partial<ChartOptions>;

  desde = '';
  hasta = '';

  async buscar() {
    if (!this.desde || !this.hasta) {
      return;
    }

    const fechaDesde = new Date(this.desde).getTime();
    const fechaHasta = new Date(this.hasta).getTime();

    const data = await this.estadisticasService.traercomentarios(
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
        type: 'area',
        foreColor: estilos.textColor,
      },
      title: {
        text: 'Comentarios',
      },
      xaxis: {
        categories: comentariosPorDia.categories,
        type: 'datetime',
      },
    };
  }

  agruparPorDia(): { categories: number[]; data: number[] } {
    const UN_DIA = 86400000;
    const comentariosPorDia = [];

    for (const comentario of this.data) {
      const timestamp = Math.floor(comentario.fecha / UN_DIA) * UN_DIA;
      comentariosPorDia.push(timestamp);
    }

    comentariosPorDia.sort((a, b) => a - b);

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
