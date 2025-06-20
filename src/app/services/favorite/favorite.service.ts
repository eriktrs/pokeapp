import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor() {}

  private storageKey = 'favorites';

  // Method to get favorites Pokemons
  getFavorites(): string[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Method to add a favorite Pokemon
  addFavorite(id: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }

  // Method to remove a favorite Pokemon
  removeFavorite(id: string): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter((favId) => favId !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  // Method to check a favorite Pokemon
  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  }
}
