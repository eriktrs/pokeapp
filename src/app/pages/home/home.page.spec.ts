import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import { HomePage } from './home.page';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { FavoriteService } from '../../services/favorite/favorite.service';
import { provideRouter } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let pokemonServiceSpy: jasmine.SpyObj<PokemonService>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    // Create spies for PokemonService and FavoriteService methods
    const pokemonSpy = jasmine.createSpyObj('PokemonService', [
      'getPokemonList',
      'extractId',
      'getAllPokemons',
    ]);
    const favoriteSpy = jasmine.createSpyObj('FavoriteService', [
      'isFavorite',
      'addFavorite',
      'removeFavorite',
    ]);

    // Subject to simulate Router navigation events
    routerEventsSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [HomePage], // HomePage is a standalone component, so import here
      providers: [
        provideRouter([]), // Provide an empty router config for the test environment
        { provide: PokemonService, useValue: pokemonSpy },
        { provide: FavoriteService, useValue: favoriteSpy },
        // Mock Router with events observable and navigate spy
        { provide: Router, useValue: { events: routerEventsSubject.asObservable(), navigate: jasmine.createSpy() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;

    pokemonServiceSpy = TestBed.inject(PokemonService) as jasmine.SpyObj<PokemonService>;
    favoriteServiceSpy = TestBed.inject(FavoriteService) as jasmine.SpyObj<FavoriteService>;
  });

  // Test: should load Pokemon list on ngOnInit call
  it('should load pokemons on ngOnInit', () => {
    // Arrange: mock Pokemon API response
    const mockResponse = {
      count: 1,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };
    pokemonServiceSpy.getPokemonList.and.returnValue(of(mockResponse));
    pokemonServiceSpy.extractId.and.returnValue('1');
    favoriteServiceSpy.isFavorite.and.returnValue(false);

    // Act: call ngOnInit
    component.ngOnInit();

    // Assert: verify that Pokemon list was fetched and component updated
    expect(pokemonServiceSpy.getPokemonList).toHaveBeenCalled();
    expect(component.pokemons.length).toBe(1);
    expect(component.pokemons[0].name).toBe('bulbasaur');
  });

  // Test: should update Pokemon list on Router navigation event to /home
  it('should update pokemons on router navigation to /home', () => {
    // Arrange: mock a different Pokemon API response
    const mockResponse = {
      count: 1,
      results: [{ name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }],
    };
    pokemonServiceSpy.getPokemonList.and.returnValue(of(mockResponse));
    pokemonServiceSpy.extractId.and.returnValue('4');
    favoriteServiceSpy.isFavorite.and.returnValue(true);

    // Act: call ngOnInit and simulate navigation event
    component.ngOnInit();
    routerEventsSubject.next(new NavigationEnd(1, '/home', '/home'));

    // Assert: verify the Pokemon list was updated on navigation event
    expect(pokemonServiceSpy.getPokemonList).toHaveBeenCalledTimes(2);
    expect(component.pokemons[0].name).toBe('charmander');
  });
});
