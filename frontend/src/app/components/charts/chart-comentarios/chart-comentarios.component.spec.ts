import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComentariosComponent } from './chart-comentarios.component';

describe('ChartComentariosComponent', () => {
  let component: ChartComentariosComponent;
  let fixture: ComponentFixture<ChartComentariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComentariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartComentariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
