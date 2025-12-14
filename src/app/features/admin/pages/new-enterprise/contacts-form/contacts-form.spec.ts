import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsForm } from './contacts-form';

describe('ContactsForm', () => {
  let component: ContactsForm;
  let fixture: ComponentFixture<ContactsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
