import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { EstadisticasTabPage } from './estadisticasTab.page';

describe('EstadisticasTabPage', () => {
  let component: EstadisticasTabPage;
  let fixture: ComponentFixture<EstadisticasTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EstadisticasTabPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
