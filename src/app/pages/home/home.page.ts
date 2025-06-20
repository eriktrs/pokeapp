import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonFooter,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';

// Import Components and Services
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonFilterComponent } from '../../components/pokemon-filter/pokemon-filter.component';

// HomePage Component
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonText,
    IonSpinner,
    IonFooter,
    IonButton,
    CommonModule,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    PokemonCardComponent,
    PokemonFilterComponent,
  ],
})
export class HomePage implements OnInit {
  // Array to hold the list of Pokemons
  pokemons: any[] = [];

  // Array to hold the saved list of Pokemons
  savedPokemons: any[] = [];

  // Array to hold all Pokemons
  allPokemons: any[] = [];

  // Variable to keep track of the total number of pages
  totalPages: number = 0;

  // Variable to keep track of the current page
  currentPage: number = 1;

  // Variable to keep track of the current length of the pokemons array
  currentLength: number = 0;

  // Variable to indicate if the data is currently loading
  loading: boolean = false;

  // Variable to keep track of the current filter
  searchText = localStorage.getItem('search') ?? '';

  // Inject the PokemonService and Router in the constructor
  constructor(private pokemonService: PokemonService, private router: Router) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit() {
    // Get the current page
    const savedPage = localStorage.getItem('currentPage');
    const page = savedPage ? Number(savedPage) : 1;

    // Load the first 20 Pokemons when the component initializes
    this.loadPokemons(page);

    // Backup of all pokemons
    this.getAllPokemons();
  }

  // Method to load more Pokemons
  loadMorePokemons() {
    if (this.currentPage < this.totalPages) {
      this.loadPokemons(this.currentPage + 1);
    }
  }

  // Method to load previous Pokemons
  loadPreviousPokemons() {
    if (this.currentPage > 1) {
      this.loadPokemons(this.currentPage - 1);
    }
  }

  // Method to filter Pokemons
  async onSearchPokemons(searchText: string) {
    if (typeof searchText !== 'string' || searchText.trim() === '') {
      this.loadPokemons(1);
      return;
    }

    // Check if search bar has any words
    if (searchText.length < 3) {
      return;
    }

    // Start filter method
    this.pokemons = this.savedPokemons.filter((p) =>
      p.name.toLowerCase().includes(searchText)
    );

    // Set current and total pages to a unique page
    this.currentPage = 1;
    this.totalPages = 1;

    // Check if filter result is not found
    if (this.pokemons.length == 0) {
      this.loadPokemons(1);
      this.savedPokemons == this.allPokemons;
      return;
    }
  }

  // Method to load Pokemons with pagination
  private async loadPokemons(page: number) {
    // Set loading to true to indicate data is being fetched
    this.loading = true;

    // Default limit and offset values
    const limit = 20;
    const offset = (page - 1) * limit;

    // Fetch the list of Pokemons from the service
    this.pokemonService
      .getPokemonList(limit, offset)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: any) => {
          // Update the total number of pages based on the response
          this.totalPages = Math.ceil(response.count / limit);

          // Map the response to the pokemons array with name, url, and image
          this.pokemons = response.results.map((pokemon: any) => ({
            id: this.pokemonService.extractId(pokemon.url),
            name: pokemon.name,
            url: pokemon.url,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemonService.extractId(
              pokemon.url
            )}.png`,
            isFavorite: false,
          }));

          // Update the current page based on the offset
          this.currentPage = page;

          // Save the current page to localStorage
          localStorage.setItem('currentPage', this.currentPage.toString());

          // Apply filter
          if (this.searchText.trim()) {
            this.onSearchPokemons(this.searchText);
          }
        },
        error: (error) => {
          console.error('Error fetching Pokemon data:', error);
        },
      });
  }

  private async getAllPokemons() {
    // Set loading to true to indicate data is being fetched
    this.loading = true;

    this.pokemonService
      .getAllPokemons()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: any) => {
          // Update the total number of pages based on the response
          this.totalPages = 1;

          // Map the response to the pokemons array with name, url, and image
          this.allPokemons = response.results.map((pokemon: any) => ({
            id: this.pokemonService.extractId(pokemon.url),
            name: pokemon.name,
            url: pokemon.url,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemonService.extractId(
              pokemon.url
            )}.png`,
            isFavorite: false
          }));

          // Create a backup array of pokemons for search method
          this.savedPokemons = this.allPokemons;

          // Update the current page based on the offset
          this.currentPage = 1;

          // Save the current page to localStorage
          localStorage.setItem('currentPage', this.currentPage.toString());
        },
      });
  }
}
