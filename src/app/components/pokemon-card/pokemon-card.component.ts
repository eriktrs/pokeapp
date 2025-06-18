import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-card',
  inputs: ['pokemon'],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  imports: [
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

  constructor(private router: Router) {}

  ngOnInit() {
    const pokemon = this.pokemon;
  }

  viewDetails(pokemon: any) {
    this.router.navigate(['details', pokemon]);
  }
}
