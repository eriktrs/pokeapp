import { routes } from './../../app.routes';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PokemonService } from './pokemon.service';
import { provideHttpClient } from '@angular/common/http';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        PokemonService
      ],
    });

    // Inject the PokemonService instance
    service = TestBed.inject(PokemonService);
    // Inject the HttpTestingController to mock HTTP requests
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  // Test if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test error throwing for invalid limit or offset parameters
  it('should throw error with invalid limit or offset', () => {
    expect(() => service.getPokemonList(-1, 0)).toThrowError(
      'Invalid limit or offset values'
    );
    expect(() => service.getPokemonList(1, -1)).toThrowError(
      'Invalid limit or offset values'
    );
  });

  // Test error throwing for invalid Pokémon name parameter
  it('should throw error when name is invalid', () => {
    expect(() => service.getPokemonDetails('')).toThrowError(
      'Invalid Pokémon name'
    );
    expect(() => service.getPokemonDetails('   ')).toThrowError(
      'Invalid Pokémon name'
    );
  });

  // Test getPokemonList sends HTTP GET request with correct URL and returns data
  it('should fetch pokemon list with correct URL', () => {
    const mockResponse = {
      count: 1,
      results: [{ name: 'bulbasaur', url: 'url1' }],
    };

    service.getPokemonList(10, 0).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    // Expect a single GET request with correct URL
    const req = httpTestingController.expectOne(
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'
    );
    expect(req.request.method).toEqual('GET');

    // Respond with mock data
    req.flush(mockResponse);

    // Verify that there are no outstanding HTTP requests
    httpTestingController.verify();
  });

  // Test getPokemonDetails sends HTTP GET request with correct URL and returns data
  it('should fetch pokemon details with correct URL', () => {
    const mockDetails = { id: 1, name: 'bulbasaur' };

    service.getPokemonDetails('bulbasaur').subscribe((data) => {
      expect(data).toEqual(mockDetails);
    });

    // Expect a GET request to the correct URL
    const req = httpTestingController.expectOne(
      'https://pokeapi.co/api/v2/pokemon/bulbasaur'
    );
    expect(req.request.method).toEqual('GET');

    // Respond with mock details
    req.flush(mockDetails);

    // Verify no outstanding requests
    httpTestingController.verify();
  });

  // Test getPokemonSpecies sends HTTP GET request with correct URL and returns data
  it('should fetch pokemon species with correct URL', () => {
    const mockSpecies = { base_happiness: 70 };

    service.getPokemonSpecies('1').subscribe((data) => {
      expect(data).toEqual(mockSpecies);
    });

    // Expect a GET request to the species URL
    const req = httpTestingController.expectOne(
      'https://pokeapi.co/api/v2/pokemon-species/1'
    );
    expect(req.request.method).toEqual('GET');

    // Respond with mock species data
    req.flush(mockSpecies);

    httpTestingController.verify();
  });

  // Test getEvolutionChainByUrl sends HTTP GET request and returns data
  it('should fetch evolution chain with correct URL', () => {
    const url = 'https://pokeapi.co/api/v2/evolution-chain/1/';
    const mockEvolution = { chain: {} };

    service.getEvolutionChainByUrl(url).subscribe((data) => {
      expect(data).toEqual(mockEvolution);
    });

    // Expect a GET request to the evolution chain URL
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');

    // Respond with mock evolution data
    req.flush(mockEvolution);

    httpTestingController.verify();
  });

  // Test getPokemonIdByName returns ID from map if exists
  it('should return ID from name if exists in map', () => {
    // Manually set internal map value for test
    (service as any).nameToIdMap['bulbasaur'] = 1;

    const id = service.getPokemonIdByName('bulbasaur');
    expect(id).toBe(1);
  });

  // Test extractId extracts ID from URL string
  it('should extract ID from URL', () => {
    const url = 'https://pokeapi.co/api/v2/pokemon/1/';
    const id = service.extractId(url);
    expect(id).toBe('1');
  });
});
