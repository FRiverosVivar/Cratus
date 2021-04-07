import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ProgramaTabPage } from './programaTab.page';

describe('ProgramaTabPage', () => {
  let component: ProgramaTabPage;
  let fixture: ComponentFixture<ProgramaTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramaTabPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramaTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
