import { TestBed } from '@angular/core/testing';

import { UiToolsService } from './ui-tools.service';

describe('UiToolsService', () => {
  let service: UiToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
