import { TestBed } from '@angular/core/testing';

import { PublicacionesService } from './publicaciones.service';

describe('ApiService', () => {
  let service: PublicacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
