import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { FavoriteService } from '../../services/favorite/favorite.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class DetailsPage implements OnInit {
  pokemon: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('name');
    if (id) {
      this.loadPokemonDetails(id);
    }
  }

  loadPokemonDetails(id: string) {
    this.loading = true;
    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (data) => {
        this.pokemon = {
          id: data.id,
          name: data.name,
          sprites: data.sprites,
          types: data.types.map((t: any) => t.type.name),
          abilities: data.abilities.map((a: any) => a.ability.name),
          height: data.height,
          weight: data.weight,
          isFavorite: this.favoriteService.isFavorite(data.id),
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading details:', err);
        this.loading = false;
      },
    });
  }

  toggleFavorite() {
    if (this.pokemon.isFavorite) {
      this.favoriteService.removeFavorite(this.pokemon.id);
      this.pokemon.isFavorite = false;
    } else {
      this.favoriteService.addFavorite(this.pokemon.id);
      this.pokemon.isFavorite = true;
    }
  }
}
