import { TestBed } from '@angular/core/testing';

import { TargetExplorerService } from './target-explorer.service';

describe('TargetExplorerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TargetExplorerService = TestBed.get(TargetExplorerService);
    expect(service).toBeTruthy();
  });
});
