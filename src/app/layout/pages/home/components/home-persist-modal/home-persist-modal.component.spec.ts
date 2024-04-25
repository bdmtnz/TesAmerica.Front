import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePersistModalComponent } from './home-persist-modal.component';

describe('HomePersistModalComponent', () => {
  let component: HomePersistModalComponent;
  let fixture: ComponentFixture<HomePersistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePersistModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePersistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
