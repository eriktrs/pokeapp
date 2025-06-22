import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  IonGrid,
  IonRow,
  IonCol,
  IonText,
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
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    CommonModule,
    FormsModule,
  ],
})
export class DetailsPage implements OnInit {
  pokemon: any;
  loading = true;
  evolutions: { name: string; image: string }[] = [];
  relatedImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoriteService: FavoriteService
  ) {}

  // Initialize the component and load Pokémon details based on the route parameter
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('name');
    if (id) {
      this.loadPokemonDetails(id);
    }
  }

  // Load Pokémon details by ID or name
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
          stats: data.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
          moves: data.moves.map((m: any) => m.move.name),
          isFavorite: this.favoriteService.isFavorite(String(data.id)),
        };

        // Related images: add other sprite versions
        this.relatedImages = this.getRelatedSprites(data.sprites);

        // Load species → evolution chain
        this.loadEvolutions(data.id);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading details:', err);
        this.loading = false;
      },
    });
  }

  // Get related sprites from the Pokémon data
  getRelatedSprites(sprites: any): string[] {
    const images: string[] = [];
    if (sprites.front_shiny) images.push(sprites.front_shiny);
    if (sprites.back_default) images.push(sprites.back_default);
    if (sprites.back_shiny) images.push(sprites.back_shiny);
    if (sprites.other?.dream_world?.front_default)
      images.push(sprites.other.dream_world.front_default);
    return images;
  }

  // Load evolutions from the Pokémon species data
  loadEvolutions(idOrName: string) {
    this.pokemonService.getPokemonSpecies(idOrName).subscribe({
      next: (speciesData) => {
        const evoUrl = speciesData.evolution_chain.url;
        this.pokemonService.getEvolutionChainByUrl(evoUrl).subscribe({
          next: (evoData) => {
            this.evolutions = this.extractEvolutions(evoData.chain);
          },
          error: (err) => console.error('Error loading evolution chain:', err),
        });
      },
      error: (err) => console.error('Error loading species data:', err),
    });
  }

  // Extract evolutions from the evolution chain
  extractEvolutions(chain: any): { name: string; image: string }[] {
    const evolutions: { name: string; image: string }[] = [];

    const traverse = (node: any) => {
      const name = node.species.name;
      const id = this.pokemonService.getPokemonIdByName(name);

      const imageUrl = id
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemonService.extractId(
            node.species.url
          )}.png`;

      evolutions.push({ name, image: imageUrl });

      node.evolves_to.forEach((evo: any) => traverse(evo));
    };

    traverse(chain);
    return evolutions;
  }

  // Toggle favorite status of the Pokémon
  toggleFavorite() {
    if (this.pokemon.isFavorite) {
      this.favoriteService.removeFavorite(String(this.pokemon.id));
      this.pokemon.isFavorite = false;
    } else {
      this.favoriteService.addFavorite(String(this.pokemon.id));
      this.pokemon.isFavorite = true;
    }
  }

  // Format Pokémon stats for display
  get formattedStats(): string {
    if (!this.pokemon?.stats) return '';
    return this.pokemon.stats
      .map((s: any) => `${s.name}: ${s.value}`)
      .join(', ');
  }
}
