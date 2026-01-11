import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageInput } from './chat-message-input';

describe('ChatMessageInput', () => {
  let component: ChatMessageInput;
  let fixture: ComponentFixture<ChatMessageInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatMessageInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMessageInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
