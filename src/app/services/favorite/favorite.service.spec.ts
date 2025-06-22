import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let service: FavoriteService;

  beforeEach(() => {
    // Configure testing module without extra providers needed
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteService);

    // Clear localStorage before each test to avoid interference
    localStorage.clear();
  });

  // Test if the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test adding a favorite and checking if it is marked as favorite
  it('should add and check favorite', () => {
    service.addFavorite('1');
    expect(service.isFavorite('1')).toBeTrue();
  });

  // Test removing a favorite and checking if it is removed
  it('should remove favorite', () => {
    service.addFavorite('2');
    service.removeFavorite('2');
    expect(service.isFavorite('2')).toBeFalse();
  });

  // Test retrieving the list of favorites
  it('should get favorites list', () => {
    service.addFavorite('3');
    service.addFavorite('4');
    const favs = service.getFavorites();
    expect(favs).toContain('3');
    expect(favs).toContain('4');
  });
});

