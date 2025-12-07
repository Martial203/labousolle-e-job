import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsManagement } from './jobs-management';

describe('JobsManagement', () => {
  let component: JobsManagement;
  let fixture: ComponentFixture<JobsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
