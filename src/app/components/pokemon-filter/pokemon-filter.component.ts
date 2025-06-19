import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-filter',
  inputs: ['pokemons', 'regions'],
  templateUrl: './pokemon-filter.component.html',
  styleUrls: ['./pokemon-filter.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class PokemonFilterComponent implements OnInit {
  constructor() {}

  // Get saved text if exists
  savedText = localStorage.getItem('search') || '';

  // Output events to communicate with parent component
  @Output() searchPokemons = new EventEmitter<string>();

  // Lifecycle hook that is called after the component has been initialized
  ngOnInit() {
    if (this.savedText) {
      this.searchPokemons.emit(this.savedText);
    }
  }

  // Method to filter Pokemons based on search input
  onSearchPokemons(userText: string | null | undefined) {
    const text = userText ?? '';

    localStorage.setItem('search', text);

    this.searchPokemons.emit(text);
  }
}
