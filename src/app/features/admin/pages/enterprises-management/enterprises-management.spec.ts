import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterprisesManagement } from './enterprises-management';

describe('EnterprisesManagement', () => {
  let component: EnterprisesManagement;
  let fixture: ComponentFixture<EnterprisesManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterprisesManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterprisesManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
