import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoseCardComponent } from './lose-card.component';

describe('LoseCardComponent', () => {
  let component: LoseCardComponent;
  let fixture: ComponentFixture<LoseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoseCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
