import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { DrinkMenuPage } from './drink-menu.page';
import { AuthService } from '../../services/auth.service';
import { DrinksService } from '../../services/drinks.service';

describe('DrinkMenuPage', () => {
  let component: DrinkMenuPage;
  let fixture: ComponentFixture<DrinkMenuPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DrinkMenuPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', { can: false }) },
        {
          provide: DrinksService,
          useValue: jasmine.createSpyObj('DrinksService', ['getDrinks', 'saveDrink', 'deleteDrink'], { items: {} })
        },
        { provide: ModalController, useValue: jasmine.createSpyObj('ModalController', ['create', 'dismiss']) },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
