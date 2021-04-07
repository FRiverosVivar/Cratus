import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { VinculacionTabPage } from './vinculacionTab.page';

describe('VinculacionTabPage', () => {
  let component: VinculacionTabPage;
  let fixture: ComponentFixture<VinculacionTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VinculacionTabPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(VinculacionTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
