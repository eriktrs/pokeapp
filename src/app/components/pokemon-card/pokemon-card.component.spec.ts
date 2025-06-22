import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { PokemonCardComponent } from './pokemon-card.component';
import { FavoriteService } from '../../services/favorite/favorite.service';

describe('PokemonCardComponent', () => {
  let component: PokemonCardComponent;
  let fixture: ComponentFixture<PokemonCardComponent>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies for FavoriteService methods
    const favoriteSpy = jasmine.createSpyObj('FavoriteService', [
      'isFavorite',
      'addFavorite',
      'removeFavorite',
    ]);
    // Create spy for Router navigate method
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PokemonCardComponent], // PokemonCardComponent is standalone
      providers: [
        provideRouter([]), // Provide empty router config
        { provide: FavoriteService, useValue: favoriteSpy },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;

    favoriteServiceSpy = TestBed.inject(FavoriteService) as jasmine.SpyObj<FavoriteService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Initialize the input property with a sample Pokemon
    component.pokemon = {
      id: 1,
      name: 'bulbasaur',
      isFavorite: false,
    };
  });

  // Test: toggleFavorite toggles favorite status and emits change event
  it('should toggle favorite status and emit change', () => {
    spyOn(component.changed, 'emit');

    favoriteServiceSpy.isFavorite.and.returnValue(false);

    component.toggleFavorite('1');

    expect(favoriteServiceSpy.addFavorite).toHaveBeenCalledWith('1');
    expect(component.pokemon.isFavorite).toBeTrue();
    expect(component.changed.emit).toHaveBeenCalledWith(jasmine.objectContaining({ id: 1 }));
  });

  // Test: viewDetails navigates to the Pokemon details page
  it('should navigate to details page', () => {
    component.viewDetails('bulbasaur');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['details', 'bulbasaur']);
  });
});
