import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather-service/weather.service';

@Component({
  selector: 'app-weathercard',
  templateUrl: './weathercard.component.html',
  styleUrls: ['./weathercard.component.css']
})
export class WeathercardComponent implements OnInit {
  allData: any=[];
  interval: any;
  selectFilter = "0";
  private cityId = [{id:634963, name:"Tampere"}, {id:655195, name:"Jyväskylä"}, {id:650225, name:"Kuopio"}, {id:660129, name:"Espoo"}];

  constructor(private wth :WeatherService) { }

  ngOnInit(): void {
    this.getData();
    this.refresh();
  }

  //Refresh data once in five minutes
  refresh(){
    this.interval = setInterval(() => {
      this.allData = [];
      this.getData();
  },180000)
  }
  //Get data from OpenWeatherMap through weather service
  getData(){
    for (var i = 0; i < this.cityId.length; i++){
      this.wth.getCurrentData(this.cityId[i].id.toString()).subscribe(d =>{
      this.allData.push(this.formatCurrentData(d));
      });
    }
  }
  //Takes and formats the datapoints needed and outputs an array containing them
  formatCurrentData(d:any){
    let formattedData:any = [];
    let fcData:any=[];

    //Makes the date look something like "Jun 16th"
    let dt = new Date(d.dt*1000);
    let date = `${dt.toString().substr(4,3)} ${dt.getDate()}`;
    switch(dt.getDate()){
      case 1: case 21: case 31:
        date += 'st';
        break;
      case 2: case 22:
        date += 'nd';
        break;
      case 3: case 23:
        date += 'rd';
        break;
      default:
        date += 'th';
    }

    //In case the rain data does not exist, as the response from OpenWeatherMap does not seem
    //to always contain .rain
    var prec;
    try{
      prec = d.rain['3h'];
    }
    catch(error){
      prec = 0;
    }

    //Get five instances of forecast weather in city and format those as well
    this.wth.getForecastData(d.id.toString()).subscribe(f =>{
      for (var i = 0; i < 5; i++){
        fcData.push(this.formatForecastData(f.list[i], d.id.toString()));
      }
    });

    //Push in to the array that will be returned from the function
    formattedData.push({
      id:d.id.toString(),
      //Get the city name from a local array using city id because the data from OWM if in english does not contain special characters (ÄÖ)
      city:this.cityId[this.cityId.findIndex(city => city.id === d.id)].name, 
      //To get the description to start with an uppercase letter
      desc:d.weather[0].description.replace(d.weather[0].description.charAt(0), d.weather[0].description.charAt(0).toUpperCase()), 
      date:date,
      //Get time from the established date 
      time:dt.toString().substr(16,5),
      //Make temp an integer 
      temp:Math.floor(d.main.temp), 
      //The link to icon
      icon:`http://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`, 
      wind:d.wind.speed, 
      humd:d.main.humidity, 
      prec:prec,
      fcast:fcData
   //   fcast: this.getForecastData(d.id.toString())
    })
    return formattedData;
  }

  //For taking and formatting the relevant datapoints in forecast data, outputting an array containing those.
  formatForecastData(f:any,id:string){
    this.wth.getForecastData(id).subscribe(f =>{
      fData = f;
    })   
    var fprec;
    try{
      fprec = f.rain['3h'];
    }
    catch{
      fprec = 0;
    }
  var fData:any = {
      time:f.dt_txt.substr(11,5),
      temp:Math.floor(f.main.temp),
      wind:f.wind.speed,
      humd:f.main.humidity,
      icon:`http://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`,
      prec:fprec
    }
      
    return fData;
  }

  //Changes the selection of dropdown menu
  changeFilter(e:any){
    this.selectFilter = e.target.value;
  }

}
