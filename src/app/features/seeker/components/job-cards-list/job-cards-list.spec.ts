import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardsList } from './job-cards-list';

describe('JobCardsList', () => {
  let component: JobCardsList;
  let fixture: ComponentFixture<JobCardsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobCardsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCardsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
