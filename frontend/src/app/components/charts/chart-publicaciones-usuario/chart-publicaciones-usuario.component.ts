import { Component, inject } from '@angular/core';
import { ChartOptions } from '../chart-types';
import { NgApexchartsModule } from 'ng-apexcharts';
import { estilos } from '../chart-style';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstadisticasService } from '../../../services/estadisticas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chart-publicaciones-usuario',
  imports: [NgApexchartsModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chart-publicaciones-usuario.component.html',
  styleUrl: './chart-publicaciones-usuario.component.css',
})
export class ChartPublicacionesUsuarioComponent {
  estilos = estilos;
  estadisticasService = inject(EstadisticasService);
  data: any;
  mostrarChart: boolean = false;
  chartOptions?: Partial<ChartOptions>;

  desde = '';
  hasta = '';
  usuarioId = '';

  async buscar() {
    if (!this.desde || !this.hasta || !this.usuarioId) {
      return;
    }

    const fechaDesde = new Date(this.desde).getTime();
    const fechaHasta = new Date(this.hasta).getTime();

    const data = await this.estadisticasService.traerPublicacionesPorUsuario(
      this.usuarioId,
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
    const publicacionesPorDia = this.agruparPorDia();

    this.chartOptions = {
      series: [
        {
          name: 'Publicaciones',
          data: publicacionesPorDia.data,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        foreColor: '#fff',
      },
      title: {
        text: 'Publicaciones de ' + this.data.username,
      },
      xaxis: {
        categories: publicacionesPorDia.categories,
        type: 'datetime',
      },
    };
  }

  agruparPorDia(): { categories: number[]; data: number[] } {
    // podria pasar el agrupamiento por parametro...
    const UN_DIA = 86400000;
    const publicacionesPorDia = [];

    for (const publicacion of this.data.publicaciones) {
      const timestamp = Math.floor(publicacion.fecha / UN_DIA) * UN_DIA;
      publicacionesPorDia.push(timestamp);
    }

    // magia
    const valores: any = {};
    for (const timestamp of publicacionesPorDia) {
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
