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

  constructor(private router: Router) {
    addIcons({ heart, logoApple, settingsSharp, star });
  }

  ngOnInit() {
    const pokemon = this.pokemon;
  }

  viewDetails(pokemon: any) {
    this.router.navigate(['details', pokemon]);
  }

  toggleFavorite(pokemon: any) {
    pokemon.isFavorite = !pokemon.isFavorite;
  }
}
