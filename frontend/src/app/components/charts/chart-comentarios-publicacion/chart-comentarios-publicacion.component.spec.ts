import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComentariosPublicacionComponent } from './chart-comentarios-publicacion.component';

describe('ChartComentariosPublicacionComponent', () => {
  let component: ChartComentariosPublicacionComponent;
  let fixture: ComponentFixture<ChartComentariosPublicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComentariosPublicacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartComentariosPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
