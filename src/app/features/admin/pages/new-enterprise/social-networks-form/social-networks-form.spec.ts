import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialNetworksForm } from './social-networks-form';

describe('SocialNetworksForm', () => {
  let component: SocialNetworksForm;
  let fixture: ComponentFixture<SocialNetworksForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialNetworksForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialNetworksForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
