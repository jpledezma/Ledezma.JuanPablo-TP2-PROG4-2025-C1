import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  fechaActual?: string;

  constructor() {
    let fecha = new Date();
    this.fechaActual = fecha.getFullYear().toString();
  }
}
