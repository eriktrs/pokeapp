import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DetailsPage } from './details.page';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { FavoriteService } from '../../services/favorite/favorite.service';

describe('DetailsPage', () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;
  let pokemonServiceSpy: jasmine.SpyObj<PokemonService>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;

  beforeEach(async () => {
    // Create spies for PokemonService methods and FavoriteService methods
    const pokemonSpy = jasmine.createSpyObj('PokemonService', [
      'getPokemonDetails',
      'getPokemonSpecies',
      'getEvolutionChainByUrl',
      'getPokemonIdByName',
      'extractId',
    ]);
    const favoriteSpy = jasmine.createSpyObj('FavoriteService', ['isFavorite', 'addFavorite', 'removeFavorite']);

    await TestBed.configureTestingModule({
      imports: [DetailsPage], // standalone component in imports
      providers: [
        provideRouter([]), // Provide empty router configuration for test
        { provide: PokemonService, useValue: pokemonSpy },
        { provide: FavoriteService, useValue: favoriteSpy },
        // Mock ActivatedRoute with snapshot paramMap returning '1' as id param
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPage);
    component = fixture.componentInstance;

    pokemonServiceSpy = TestBed.inject(PokemonService) as jasmine.SpyObj<PokemonService>;
    favoriteServiceSpy = TestBed.inject(FavoriteService) as jasmine.SpyObj<FavoriteService>;
  });

  // Test: should load Pokemon details on ngOnInit call
  it('should load pokemon details on ngOnInit', () => {
    // Arrange: prepare mock Pokemon details response
    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      sprites: {
        front_shiny: 'front_shiny_url',
        back_default: 'back_default_url',
        back_shiny: 'back_shiny_url',
        other: { dream_world: { front_default: 'dream_world_url' } },
      },
      types: [{ type: { name: 'grass' } }],
      abilities: [{ ability: { name: 'overgrow' } }],
      height: 7,
      weight: 69,
      stats: [],
      moves: [],
    };
    pokemonServiceSpy.getPokemonDetails.and.returnValue(of(mockPokemonDetails));
    favoriteServiceSpy.isFavorite.and.returnValue(true);

    // Arrange: mock species and evolution chain responses
    const mockSpeciesData = { evolution_chain: { url: 'evo_url' } };
    pokemonServiceSpy.getPokemonSpecies.and.returnValue(of(mockSpeciesData));
    pokemonServiceSpy.getEvolutionChainByUrl.and.returnValue(
      of({
        chain: {
          species: { name: 'bulbasaur', url: 'url1' },
          evolves_to: [],
        },
      })
    );
    pokemonServiceSpy.getPokemonIdByName.and.returnValue(1);

    // Act: call ngOnInit
    component.ngOnInit();

    // Assert: verify Pokemon details and evolutions are loaded properly
    expect(pokemonServiceSpy.getPokemonDetails).toHaveBeenCalledWith('1');
    expect(component.pokemon.name).toBe('bulbasaur');
    expect(component.relatedImages.length).toBeGreaterThan(0);
    expect(component.evolutions.length).toBe(1);
    expect(component.pokemon.isFavorite).toBeTrue();
  });
});
