import { Component, EventEmitter, AfterViewInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-filter',
  inputs: ['pokemons', 'regions'],
  templateUrl: './pokemon-filter.component.html',
  styleUrls: ['./pokemon-filter.component.scss'],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class PokemonFilterComponent implements AfterViewInit {
  constructor() {}

  // Get saved text if exists
  private searchText = localStorage.getItem('search') || '';

  // Output events to communicate with parent component
  @Output() searchPokemons = new EventEmitter<any>();

  // Lifecycle hook that is called after the component has been initialized
  ngAfterViewInit() {
    const searchInput = document.getElementById('searchPoke') as HTMLInputElement | null;
    if (searchInput) {
      searchInput.value = this.searchText;
    }
  }

  // Method to filter Pokemons based on search input and selected generation
  onSearchPokemons(text: any) {
    if (text === '') {
      return;
    }
    this.searchPokemons.emit(text);
  }
}
