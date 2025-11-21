import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { WeatherService, WeatherData } from '../../services/weather.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './news.html',
  styleUrls: ['./news.scss']
})
export class NewsComponent implements OnInit {
  weatherData: WeatherData | null = null;
  loading = true;
  error: string | null = null;

  // Coordonnées de Barcy
  readonly lat = 49.0131;
  readonly lon = 2.9006;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    this.weatherService.getCurrentWeather(this.lat, this.lon).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Impossible de récupérer la météo.";
        this.loading = false;
      }
    });
  }

  getWeatherIconUrl(icon: string): string {
    return this.weatherService.getWeatherIconUrl(icon);
  }
}