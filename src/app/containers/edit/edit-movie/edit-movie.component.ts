import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { Movie } from '../../../models/movie-model';
import { getMoviesByUser } from '../../../facades/movies.facade';

type EditMovieForm = {
  title: string;
  director: string;
  rating: number;
  timesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  seenAtCinema: boolean;
  releaseDate: string;
  length: number;
  genre: string;
  coverUrl: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.scss'],
})
export class EditMovieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly movieForm = signal<EditMovieForm | null>(null);
  readonly movieNotFound = signal<boolean>(false);

  readonly movieSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.loadMovieFromSlug(params);
    });
  }

  updateField<K extends keyof EditMovieForm>(field: K, value: string | number) {
    const current = this.movieForm();
    if (!current) return;

    let nextValue: EditMovieForm[K] = value as EditMovieForm[K];
    if (field === 'rating' || field === 'timesWatched' || field === 'length') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditMovieForm[K];
    }

    this.movieForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'seenAtCinema', checked: boolean) {
    const current = this.movieForm();
    if (!current) return;
    this.movieForm.set({
      ...current,
      [field]: checked,
    });
  }

  onSubmit() {
    console.log('edit-movie:submit', this.movieForm());
  }

  navigateToMovies() {
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'movies']);
  }

  private loadMovieFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const movies = getMoviesByUser(userId);
    const matched = movies.find((movie) => {
      return this.toSlug(`${movie.title} ${movie.director}`) === slug;
    });

    if (!matched) {
      this.movieForm.set(null);
      this.movieNotFound.set(true);
      return;
    }

    this.movieForm.set(this.toForm(matched));
    this.movieNotFound.set(false);
  }

  private getCurrentUserId(): string {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private toForm(movie: Movie): EditMovieForm {
    return {
      title: movie.title,
      director: movie.director,
      rating: movie.rating,
      timesWatched: movie.timesWatched,
      firstViewedDate: movie.firstViewedDate,
      lastViewedDate: movie.lastViewedDate,
      seenAtCinema: movie.seenAtCinema,
      releaseDate: movie.releaseDate,
      length: movie.length,
      genre: movie.genre,
      coverUrl: movie.coverUrl,
    };
  }

  private toSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }
}
