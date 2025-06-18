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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/angular/standalone';
import { PokemonService } from '../../services/pokemon.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    IonButtons,
    IonButton,
    IonMenuButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
],
})

export class HomePage implements OnInit {
  pokemons: any[] = [];

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit() {
    // Load the first 20 Pokémons when the component initializes
    this.loadPokemons(20, 0);
  }

  // Method to load Pokémons with pagination
  loadPokemons(limit: number, offset: number) {
    this.pokemonService.getPokemonList(limit, offset).subscribe((response: any) => {
      this.pokemons = response.results.map((pokemon: any) => ({
        name: pokemon.name,
        url: pokemon.url,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.extractId(pokemon.url)}.png`
      }));
    });
  }

  // Method to navigate to the details page with the Pokémon name
  viewDetails(pokemon: any) {
    this.router.navigate(['details', pokemon]);
  }

  // Private method to extract the Pokémon ID from the URL
  private extractId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
