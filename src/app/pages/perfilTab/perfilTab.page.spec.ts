import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { PerfilTab } from './perfilTab.page';

describe('PerfilTab', () => {
  let component: PerfilTab;
  let fixture: ComponentFixture<PerfilTab>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilTab],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
