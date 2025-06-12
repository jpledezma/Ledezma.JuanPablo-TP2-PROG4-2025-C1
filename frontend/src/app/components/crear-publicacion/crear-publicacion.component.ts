import { Component, OnDestroy, output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-crear-publicacion',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './crear-publicacion.component.html',
  styleUrl: './crear-publicacion.component.css',
})
export class CrearPublicacionComponent implements OnDestroy {
  cerrarForm = output<void>();
  formulario: FormGroup;

  constructor() {
    this.formulario = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      contenido: new FormControl('', [Validators.required]),
      imagen: new FormControl('', [Validators.required]),
    });

    // bloquear scroll
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // desbloquear el scroll
    document.body.style.overflow = 'initial';
  }

  salir() {
    this.cerrarForm.emit();
  }

  publicar() {}
}
