import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  dt: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'ef7cd38133a434fda063280819456fbb';
  private baseUrl = 'https://api.openweathermap.org/data/3.0';
  // https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

  constructor(private http: HttpClient) { }

  getCurrentWeather(lat: number, lon: number): Observable<WeatherData> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${this.apiKey}`;
    return this.http.get<WeatherData>(url);
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}