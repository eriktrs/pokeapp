import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  // Base URL for the Pokémon API
  private baseUrl: string = 'https://pokeapi.co/api/v2';

  // Database name
  private databaseName = 'PokeApp';

  // Database Version
  private databaseVersion = 1;

  // Database configuration
  private database: IDBDatabase | null = null;

  // Constructor to inject HttpClient
  constructor(private http: HttpClient) {}

  // Method to initialize the database
  initDatabase() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, this.databaseVersion);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        reject(event);
      };

      request.onsuccess = (event: any) => {
        this.database = event.target.result;
        console.log('IndexedDB aberto');
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        this.database = event.target.result;
        if (!this.database!.objectStoreNames.contains('pokemons')) {
          const store = this.database!.createObjectStore('pokemons', {
            keyPath: 'id',
          });
          store.createIndex('name', 'name', { unique: true });
        }
      };
    });
  }

  // Method to save Pokemons to the database
  savePokemonsToDatabase(pokemons: any[]) {
    return new Promise<void>((resolve, reject) => {
      if (!this.database) {
        reject('The database is not initialized');
        return;
      }

      const transaction = this.database.transaction(['pokemons'], 'readwrite');
      const store = transaction.objectStore('pokemons');

      pokemons.forEach((p) => {
        const id = +this.extractId(p.url);
        store.put({ id, name: p.name, url: p.url });
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event);
    });
  }

  // Method to get list of Pokemons in database
  getPokemonsFromDatabase(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.database) {
        reject('The database is not initialized');
        return;
      }

      const transaction = this.database.transaction(['pokemons'], 'readonly');
      const store = transaction.objectStore('pokemons');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error('Error:', event);
        reject(event);
      };
    });
  }


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
}
