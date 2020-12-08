import { TestBed } from '@angular/core/testing';

import { WorldwideService } from './worldwide.service';

describe('WorldwideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorldwideService = TestBed.get(WorldwideService);
    expect(service).toBeTruthy();
  });
});
