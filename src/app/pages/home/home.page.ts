import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
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

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons(20, 0);
  }

  loadPokemons(limit: number, offset: number) {
    this.pokemonService.getPokemonList(limit, offset).subscribe((response: any) => {
      this.pokemons = response.results.map((p: any) => ({
        name: p.name,
        url: p.url,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.extractId(p.url)}.png`
      }));
    });
  }

  private extractId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
