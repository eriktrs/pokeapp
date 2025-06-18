import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonFooter,
  IonSpinner, IonText } from '@ionic/angular/standalone';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonText,
    IonSpinner,
    IonFooter,
    IonButton,
    CommonModule,
    IonButtons,
    IonMenuButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    PokemonCardComponent],
})
export class HomePage implements OnInit {
  // Array to hold the list of Pokemons
  pokemons: any[] = [];

  // Variable to keep track of the total number of pages
  totalPages: number = 0;

  // Variable to keep track of the current page
  currentPage: number = 1;

  // Variable to keep track of the current length of the pokemons array
  currentLength: number = 0;

  // Variable to indicate if the data is currently loading
  loading: boolean = false;

  // Inject the PokemonService and Router in the constructor
  constructor(private pokemonService: PokemonService, private router: Router) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit() {
    // Get the current page
    const savedPage = localStorage.getItem('currentPage');
    const page = savedPage ? Number(savedPage) : 1;
    // Load the first 20 Pokemons when the component initializes
    this.loadPokemons(page);
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

  // Method to load Pokemons with pagination
  private loadPokemons(page: number) {
    // Set loading to true to indicate data is being fetched
    this.loading = true;

    // Limit and offset for pagination
    const limit = 20;
    const offset = (page - 1) * limit;

    // Fetch the list of Pokemons from the service
    this.pokemonService.getPokemonList(limit, offset)
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: (response: any) => {
        // Update the total number of pages based on the response
        this.totalPages = Math.ceil(response.count / limit);

        // Map the response to the pokemons array with name, url, and image
        this.pokemons = response.results.map((pokemon: any) => ({
          name: pokemon.name,
          url: pokemon.url,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.extractId(
            pokemon.url
          )}.png`,
        }));

        // Update the current page based on the offset
        this.currentPage = page;

        // Save the current page to localStorage
        localStorage.setItem('currentPage', this.currentPage.toString());
      },
      error: (error) => {
        console.error('Error fetching Pokemon data:', error);
      }
    });
  }

  // Method to extract the Pokemon ID from the URL
  private extractId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
