import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseInterests } from './choose-interests';

describe('ChooseInterests', () => {
  let component: ChooseInterests;
  let fixture: ComponentFixture<ChooseInterests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseInterests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseInterests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
