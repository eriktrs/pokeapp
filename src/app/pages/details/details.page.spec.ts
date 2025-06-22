import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DetailsPage } from './details.page';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { FavoriteService } from '../../services/favorite/favorite.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DetailsPage', () => {
  let component: DetailsPage;
  let fixture: ComponentFixture<DetailsPage>;
  let pokemonServiceSpy: jasmine.SpyObj<PokemonService>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteService>;

  beforeEach(async () => {
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
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: PokemonService, useValue: pokemonSpy },
        { provide: FavoriteService, useValue: favoriteSpy },
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

  it('should load pokemon details on ngOnInit', () => {
    // Arrange: mock data for getPokemonDetails
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

    // Mock species and evolution chain calls
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

    // Act
    component.ngOnInit();

    // Assert
    expect(pokemonServiceSpy.getPokemonDetails).toHaveBeenCalledWith('1');
    expect(component.pokemon.name).toBe('bulbasaur');
    expect(component.relatedImages.length).toBeGreaterThan(0);
    expect(component.evolutions.length).toBe(1);
    expect(component.pokemon.isFavorite).toBeTrue();
  });
});
