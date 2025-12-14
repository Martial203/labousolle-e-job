import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEnterprise } from './new-enterprise';

describe('NewEnterprise', () => {
  let component: NewEnterprise;
  let fixture: ComponentFixture<NewEnterprise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewEnterprise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEnterprise);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
