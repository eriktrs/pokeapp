import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import { HomePage } from './home.page';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { FavoriteService } from '../../services/favorite/favorite.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let pokemonServiceSpy: jasmine.SpyObj<PokemonService>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    // Create spies for services
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

    // Create a mock Router with events as a Subject to simulate navigation events
    routerEventsSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [HomePage], // <-- HomePage is standalone, so import here
      providers: [
        { provide: PokemonService, useValue: pokemonSpy },
        { provide: FavoriteService, useValue: favoriteSpy },
        { provide: Router, useValue: { events: routerEventsSubject.asObservable() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;

    pokemonServiceSpy = TestBed.inject(PokemonService) as jasmine.SpyObj<PokemonService>;
    favoriteServiceSpy = TestBed.inject(FavoriteService) as jasmine.SpyObj<FavoriteService>;
  });

  it('should load pokemons on ngOnInit', () => {
    // Arrange
    const mockResponse = {
      count: 1,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    };
    pokemonServiceSpy.getPokemonList.and.returnValue(of(mockResponse));
    pokemonServiceSpy.extractId.and.returnValue('1');
    favoriteServiceSpy.isFavorite.and.returnValue(false);

    // Act
    component.ngOnInit();

    // Assert
    expect(pokemonServiceSpy.getPokemonList).toHaveBeenCalled();
    expect(component.pokemons.length).toBe(1);
    expect(component.pokemons[0].name).toBe('bulbasaur');
  });

  it('should update pokemons on router navigation to /home', () => {
    // Arrange
    const mockResponse = {
      count: 1,
      results: [{ name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }],
    };
    pokemonServiceSpy.getPokemonList.and.returnValue(of(mockResponse));
    pokemonServiceSpy.extractId.and.returnValue('4');
    favoriteServiceSpy.isFavorite.and.returnValue(true);

    // Act
    component.ngOnInit();
    // Simulate navigation event
    routerEventsSubject.next(new NavigationEnd(1, '/home', '/home'));

    // Assert
    expect(pokemonServiceSpy.getPokemonList).toHaveBeenCalledTimes(2);
    expect(component.pokemons[0].name).toBe('charmander');
  });
});
