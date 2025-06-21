import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  // Base URL for the Pokémon API
  private readonly baseUrl: string = 'https://pokeapi.co/api/v2';

  private nameToIdMap: Record<string, number> = {};

  // Constructor to inject HttpClient
  constructor(private http: HttpClient) {}

  // Method to get a list of Pokemons
  getPokemonList(limit: number, offset: number) {
    // Construct the URL with query parameters for pagination

    // Validate the limit and offset parameters
    if (limit <= 0 || offset < 0) {
      throw new Error('Invalid limit or offset values');
    }

    if (typeof limit !== 'number' || typeof offset !== 'number') {
      throw new Error('Limit and offset must be numbers');
    }

    if (Number.isNaN(limit) || Number.isNaN(offset)) {
      throw new Error('Limit and offset must be Numbers');
    }

    // Return the observable from the HTTP request
    return this.http.get<any>(
      `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
    );
  }

  // Method to get a full list of Pokemons
  getAllPokemons() {
    // Return Pokemon List
    return this.getPokemonList(1300, 0);
  }

  // Method to get details of a specific Pokémon by name
  getPokemonDetails(name: string) {
    // Validate the name parameter
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Invalid Pokémon name');
    }

    // Return the observable from the HTTP request
    return this.http.get<any>(`${this.baseUrl}/pokemon/${name}`);
  }

  // Method to extract the Pokemon ID from the URL
  extractId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }

  // Method to extract Pokemon Species
  getPokemonSpecies(idOrName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${idOrName}`);
  }

  // Method to get evolutions of the same species
  getEvolutionChainByUrl(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  // Method to get Pokemon ID by name
  getPokemonIdByName(name: string): number | null {
    const key = name.toLowerCase();
    return this.nameToIdMap[key] ?? null;
  }

}
