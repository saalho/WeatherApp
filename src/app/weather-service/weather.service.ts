import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  //In this case apiKey is stored in weather service rather than in a .env-file to make replacing it simpler.
  private apikey = "____APIKEY HERE____"
  
  constructor(private http: HttpClient) { }

  getCurrentData(city:string){
    return this.http.get<any>(`http://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${this.apikey}&units=metric`);
  }
  getForecastData(city:string){
    return this.http.get<any>(`http://api.openweathermap.org/data/2.5/forecast?id=${city}&cnt=5&units=metric&appid=${this.apikey}`);
  }
}
