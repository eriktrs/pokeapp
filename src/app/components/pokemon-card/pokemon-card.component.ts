import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';
import { FavoriteService } from '../../services/favorite/favorite.service';

@Component({
  selector: 'app-pokemon-card',
  inputs: ['pokemon'],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  imports: [
    IonIcon,
    IonButton,
    IonButtons,
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
})
export class PokemonCardComponent implements OnInit {
  pokemon: any;
  @Output() changed = new EventEmitter<any>();

  constructor(private favoriteService: FavoriteService ,private router: Router) {
    addIcons({ star });
  }

  ngOnInit() {}

  // Method to view Pokemon details
  viewDetails(pokemon: string) {
    this.router.navigate(['details', pokemon]);
  }

  // Method to toggle favorites Pokemons
  toggleFavorite(pokemonId: string) {
  if (this.favoriteService.isFavorite(pokemonId)) {
    this.favoriteService.removeFavorite(String(pokemonId));
    this.pokemon.isFavorite = false;
  } else {
    this.favoriteService.addFavorite(String(pokemonId));
    this.pokemon.isFavorite = true;
  }

  // Update the pokemon list
  this.changed.emit({ ...this.pokemon });
}

  // Method to check if this Pokemon is favorite
  isFavorite(pokemonId:string): boolean {
    return this.favoriteService.isFavorite(pokemonId);
  }
}
