import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBox } from './check-box';

describe('CheckBox', () => {
  let component: CheckBox;
  let fixture: ComponentFixture<CheckBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
