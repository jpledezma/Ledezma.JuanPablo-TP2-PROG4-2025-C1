import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPublicacionesUsuarioComponent } from './chart-publicaciones-usuario.component';

describe('ChartPublicacionesUsuarioComponent', () => {
  let component: ChartPublicacionesUsuarioComponent;
  let fixture: ComponentFixture<ChartPublicacionesUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartPublicacionesUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartPublicacionesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
