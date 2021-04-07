import { TestBed } from '@angular/core/testing';

import { BlesService } from './bles.service';

describe('BlesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlesService = TestBed.get(BlesService);
    expect(service).toBeTruthy();
  });
});
