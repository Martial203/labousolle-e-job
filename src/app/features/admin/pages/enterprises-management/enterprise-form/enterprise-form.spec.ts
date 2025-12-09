import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseForm } from './enterprise-form';

describe('EnterpriseForm', () => {
  let component: EnterpriseForm;
  let fixture: ComponentFixture<EnterpriseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterpriseForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterpriseForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
