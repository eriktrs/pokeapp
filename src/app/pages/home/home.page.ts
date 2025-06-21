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
  IonText,
  IonLoading,
  IonLabel,
  IonSegmentButton,
  IonSegment,
} from '@ionic/angular/standalone';

// Import Components and Services
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { FavoriteService } from '../../services/favorite/favorite.service';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonFilterComponent } from '../../components/pokemon-filter/pokemon-filter.component';

// HomePage Component
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonText,
    IonLoading,
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
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class HomePage implements OnInit {
  // Array to hold the list of Pokemons
  pokemons: any[] = [];

  // Array to hold the saved list of Pokemons
  savedPokemons: any[] = [];

  // Array to hold the filtered list of Pokemons
  filteredPokemons: any[] = [];

  // Array to hold the favorite list of Pokemons
  favoritePokemons: any[] = [];

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

  // Variable to check segment value
  segmentValue: string = 'all';

  // Inject the PokemonService and Router in the constructor
  constructor(
    private pokemonService: PokemonService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

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

    // Reset filter
    this.refreshFilter();

    // Start filter method
    this.pokemons = this.filteredPokemons.filter((p) =>
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

  onSegmentChange(event: any) {
    this.segmentValue = event.detail.value;
    this.applySegmentFilter();
  }

  onCardChange(updatedPokemon: any) {
  // Update list of all pokemons
  const indexAll = this.allPokemons.findIndex(p => p.id === updatedPokemon.id);
  if (indexAll > -1) {
    this.allPokemons[indexAll] = { ...updatedPokemon };
  }

  // Update list of updated pokemons
  const indexCurrent = this.pokemons.findIndex(p => p.id === updatedPokemon.id);
  if (indexCurrent > -1) {
    // Remove if selected pokemon is not in favorites
    if (this.segmentValue === 'favorites' && !updatedPokemon.isFavorite) {
      this.pokemons.splice(indexCurrent, 1);
    } else {
      this.pokemons[indexCurrent] = { ...updatedPokemon };
    }
  } else {
    // If any pokemon is missing in actual list
    if (this.segmentValue === 'all') {
      this.pokemons.push({ ...updatedPokemon });
    }
  }

  // Update in favorite list of pokemons
  const indexFav = this.favoritePokemons.findIndex(p => p.id === updatedPokemon.id);
  if (updatedPokemon.isFavorite) {
    if (indexFav === -1) {
      this.favoritePokemons.push({ ...updatedPokemon });
    } else {
      this.favoritePokemons[indexFav] = { ...updatedPokemon };
    }
  } else {
    if (indexFav > -1) {
      this.favoritePokemons.splice(indexFav, 1);
    }
  }
}


  // Method do apply segment filter
  private async applySegmentFilter() {
    // Get all pokemons before filter
    this.refreshFilter();

    // If there is any favorite Pokemon
    if (this.segmentValue === 'favorites') {
      this.favoritePokemons = this.filteredPokemons.filter((p) => p.isFavorite);
      this.pokemons = this.favoritePokemons;
    } else {
      this.pokemons = this.savedPokemons;
    }
  }

  // Method to refresh values
  private refreshFilter() {
    // Get all pokemons before filter
    this.filteredPokemons = this.allPokemons;
    this.pokemons = this.savedPokemons;
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
            isFavorite: this.favoriteService.isFavorite(this.pokemonService.extractId(pokemon.url)),
          }));

          // Update the current page based on the offset
          this.currentPage = page;

          // Save the current page to localStorage
          localStorage.setItem('currentPage', this.currentPage.toString());

          // Create a backup of current list
          this.savedPokemons = this.pokemons;

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

          // Map the response to the pokemons array with name, url, and image
          this.allPokemons = response.results.map((pokemon: any) => ({
            id: this.pokemonService.extractId(pokemon.url),
            name: pokemon.name,
            url: pokemon.url,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemonService.extractId(
              pokemon.url
            )}.png`,
            isFavorite: this.favoriteService.isFavorite(this.pokemonService.extractId(pokemon.url)),
          }));

          // Save the current page to localStorage
          localStorage.setItem('currentPage', this.currentPage.toString());
        },
      });
  }
}
