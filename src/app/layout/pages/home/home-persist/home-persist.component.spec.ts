import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePersistComponent } from './home-persist.component';

describe('HomePersistComponent', () => {
  let component: HomePersistComponent;
  let fixture: ComponentFixture<HomePersistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePersistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePersistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
