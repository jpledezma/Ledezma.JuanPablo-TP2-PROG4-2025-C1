import { Component, inject, OnDestroy, output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PublicacionesService } from '../../services/publicaciones.service';

@Component({
  selector: 'app-crear-publicacion',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './crear-publicacion.component.html',
  styleUrl: './crear-publicacion.component.css',
})
export class CrearPublicacionComponent implements OnDestroy {
  cerrarForm = output<void>();
  service = inject(PublicacionesService);
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

  async publicar() {
    const publicacion = {
      usuarioId: 's',
      titulo: this.formulario.value.titulo.trim(),
      contenido: this.formulario.value.contenido.trim(),
    };

    let respuesta = await this.service.crearPublicacion(publicacion);

    if (respuesta === null) {
      console.log('Falló');
    } else {
      console.log('Piola');
      this.salir();
    }
  }
}
