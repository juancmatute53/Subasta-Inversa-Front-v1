import { TestBed } from '@angular/core/testing';

import { UsuarioCrudService } from './usuario-crud.service';

describe('UsuarioCrudService', () => {
  let service: UsuarioCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
