import { Component, OnInit } from '@angular/core';
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
import { heart, logoApple, settingsSharp, star } from 'ionicons/icons';
import { FavoriteService } from 'src/app/services/favorite/favorite.service';

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

  constructor(private favoriteService: FavoriteService ,private router: Router) {
    addIcons({ heart, logoApple, settingsSharp, star });
  }

  ngOnInit() {}

  // Method to view Pokemon details
  viewDetails(pokemon: string) {
    this.router.navigate(['details', pokemon]);
  }

  // Method to toggle favorites Pokemons
  toggleFavorite(pokemonId: string) {
    if (this.favoriteService.isFavorite(pokemonId)) {
      this.favoriteService.removeFavorite(pokemonId);
    } else {
      this.favoriteService.addFavorite(pokemonId);
    }
  }

  // Method to check if this Pokemon is favorite
  isFavorite(pokemonId:string): boolean {
    return this.favoriteService.isFavorite(pokemonId);
  }
}
