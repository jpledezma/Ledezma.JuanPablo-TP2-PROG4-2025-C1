import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionIndividualComponent } from './publicacion-individual.component';

describe('PublicacionIndividualComponent', () => {
  let component: PublicacionIndividualComponent;
  let fixture: ComponentFixture<PublicacionIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
