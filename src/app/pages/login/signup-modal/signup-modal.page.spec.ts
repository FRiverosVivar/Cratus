import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupModalPage } from './signup-modal.page';

describe('SignupModalPage', () => {
  let component: SignupModalPage;
  let fixture: ComponentFixture<SignupModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
