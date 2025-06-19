import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  // Base URL for the Pokémon API
  private baseUrl: string = 'https://pokeapi.co/api/v2';

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
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`);
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
}
