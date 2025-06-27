import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  imports: [],
  templateUrl: './no-encontrado.component.html',
  styleUrl: './no-encontrado.component.css',
})
export class NoEncontradoComponent {
  router = inject(Router);

  volverAInicio() {
    this.router.navigateByUrl('/');
  }
}
