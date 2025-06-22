import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonFilterComponent } from './pokemon-filter.component';
import { FormsModule } from '@angular/forms';

describe('PokemonFilterComponent', () => {
  let component: PokemonFilterComponent;
  let fixture: ComponentFixture<PokemonFilterComponent>;

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.returnValue('pikachu');

    await TestBed.configureTestingModule({
      imports: [PokemonFilterComponent, FormsModule], // Import standalone component and FormsModule
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonFilterComponent);
    component = fixture.componentInstance;
  });

  // Test if the component is created successfully
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test if ngOnInit emits search event with saved text from localStorage
  it('should emit searchPokemons event on ngOnInit if savedText exists', () => {
    // Spy on EventEmitter before ngOnInit is triggered
    spyOn(component.searchPokemons, 'emit');

    // Call ngOnInit manually
    component.ngOnInit();

    // Expect the event to have been emitted with 'pikachu'
    expect(component.searchPokemons.emit).toHaveBeenCalledWith('pikachu');
  });

  // Test if onSearchPokemons emits event and saves to localStorage
  it('should emit searchPokemons event and save text to localStorage on onSearchPokemons call', () => {
    spyOn(component.searchPokemons, 'emit');
    spyOn(localStorage, 'setItem');

    const inputText = 'charmander';
    component.onSearchPokemons(inputText);

    expect(component.searchPokemons.emit).toHaveBeenCalledWith(inputText);
    expect(localStorage.setItem).toHaveBeenCalledWith('search', inputText);
  });

  // Test if onSearchPokemons emits empty string when input is null or undefined
  it('should emit empty string if input is null or undefined in onSearchPokemons', () => {
    spyOn(component.searchPokemons, 'emit');
    spyOn(localStorage, 'setItem');

    component.onSearchPokemons(null);
    expect(component.searchPokemons.emit).toHaveBeenCalledWith('');

    component.onSearchPokemons(undefined);
    expect(component.searchPokemons.emit).toHaveBeenCalledWith('');
  });
});
