import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInfosForm } from './general-infos-form';

describe('GeneralInfosForm', () => {
  let component: GeneralInfosForm;
  let fixture: ComponentFixture<GeneralInfosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralInfosForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralInfosForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
