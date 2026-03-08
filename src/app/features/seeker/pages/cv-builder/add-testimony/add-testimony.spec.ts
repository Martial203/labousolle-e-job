import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestimony } from './add-testimony';

describe('AddTestimony', () => {
  let component: AddTestimony;
  let fixture: ComponentFixture<AddTestimony>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTestimony]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTestimony);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
