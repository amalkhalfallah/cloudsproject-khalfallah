import { Component, OnInit } from '@angular/core';
import { CountryService } from '../services/country.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Country } from '../models/Country';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { DatePipe } from '@angular/common';
import { SingleCountry } from '../models/SingleCountry';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  providers: [DatePipe]
})
export class CountryComponent implements OnInit {

  //books: Observable<Country[]>;

  contrycode: string
  Countries: SingleCountry[];
  ccountries: Country[];



  Countriess: SingleCountry[];
  Death: Array<number> = []
  Recovered: Array<number> = []
  Confirmed: Array<number> = []

  private Countryy: Country = {
    "Country": "",
    "CountryCode": "",
    "Slug": "",
    "NewConfirmed": 0,
    "TotalConfirmed": 0,
    "NewDeaths": 0,
    "TotalDeaths": 0,
    "NewRecovered": 0,
    "TotalRecovered": 0,
    "Date": ""
  }
  Country: Country = {
    "Country": "",
    "CountryCode": "",
    "Slug": "",
    "NewConfirmed": 0,
    "TotalConfirmed": 0,
    "NewDeaths": 0,
    "TotalDeaths": 0,
    "NewRecovered": 0,
    "TotalRecovered": 0,
    "Date": ""
  }

  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], ['Active Cases']]
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';

  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: ['#ED97AB', '#87C7F3', '#FDE29D']
    },
  ];

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };



  dateObj = new Date();
  month1 = this.dateObj.getUTCMonth() + 1; //months from 1-12
  day1 = this.dateObj.getUTCDate();
  month2 = this.dateObj.getUTCMonth() + 1;
  day2 = this.dateObj.getUTCDate() - 1;
  month3 = this.dateObj.getUTCMonth() + 1;
  day3 = this.dateObj.getUTCDate() - 2;
  month4 = this.dateObj.getUTCMonth() + 1;
  day4 = this.dateObj.getUTCDate() - 3;
  month5 = this.dateObj.getUTCMonth() + 1;
  day5 = this.dateObj.getUTCDate() - 4;
  month6 = this.dateObj.getUTCMonth() + 1;
  day6 = this.dateObj.getUTCDate() - 5;
  month7 = this.dateObj.getUTCMonth() + 1;
  day7 = this.dateObj.getUTCDate() - 6;



  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  public barChartLabels: Label[] = ['' + this.day7 + '/' + this.month7, '' + this.day6 + '/' + this.month6, '' + this.day5 + '/' + this.month5, '' + this.day4 + '/' + this.month4, '' + this.day3 + '/' + this.month3, '' + this.day2 + '/' + this.month2, '' + this.day1 + '/' + this.month1];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  barChartData: ChartDataSets[] = [];




  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartOptions: ChartOptions = {
    responsive: true
  };
  lineChartLegend = true;
  lineChartType = 'line';
  lineChartPlugins = [];



  myDate = new Date();
  private today;
  private seven

  constructor(private ar: ActivatedRoute, private CountryService: CountryService, private route: Router, private datePipe: DatePipe) {
    this.ar.paramMap.subscribe(res => this.contrycode = (res.get('id')));
    this.ar.paramMap.subscribe(res => this.Country = Object(this.route.getCurrentNavigation().extras.state));
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    var myCurrentDate = new Date();
    var myPastDate = new Date(myCurrentDate);
    myPastDate.setDate(myPastDate.getDate() - 7);
    this.myDate = new Date();

    this.today = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.seven = this.datePipe.transform(myPastDate, 'yyyy-MM-dd');



  }
  ngOnInit() {
    this.getCountry(this.contrycode);
    this.getagetTotalydate();
    this.getdayone()
  }


  getCountryList() {

    this.CountryService.getPolicies()
      .subscribe((countries: Country[]) => {
        this.ccountries = countries;
        console.log(this.ccountries)
      });

  }
  getCountry(id: string) {
    this.CountryService.search(id)
      .subscribe((countries: Country) => {

        this.Countryy = countries;
        if (this.Countryy == null) {
          console.log('im adding the shit')
          this.addCountry(this.Country)

        }
        else {
          this.updateCountry(this.contrycode, this.Country)
          this.pieChartData = [this.Countryy.TotalDeaths, this.Countryy.TotalRecovered, this.Countryy.TotalConfirmed - this.Countryy.TotalRecovered]
        }
      });

  }


  addCountry(country: Country) {
    this.CountryService.createPolicy(country);
  }


  updateCountry(key: string, value: any) {

    this.CountryService.updatePolicy(key, value)
  }




  getagetTotalydate() {
    return this.CountryService.getTotalydate(this.contrycode, this.seven, this.today).subscribe(
      data => {
        this.Countries = data;
        console.log("7 days")
        console.log(this.contrycode)
        console.log(this.seven)
        console.log(this.today)
        console.log(this.Countries)
      },
      err => console.error(err),
      () => {
        for (let i = 0; i <= this.Countries.length; i++) {
          this.barChartData = [
            { data: [this.Countries[i].Deaths, this.Countries[i + 1].Deaths, this.Countries[i + 2].Deaths, this.Countries[i + 3].Deaths, this.Countries[i + 4].Deaths, this.Countries[i + 5].Deaths, this.Countries[i + 6].Deaths], label: 'Daily Deaths' },
            { data: [this.Countries[i].Recovered, this.Countries[i + 1].Recovered, this.Countries[i + 2].Recovered, this.Countries[i + 3].Recovered, this.Countries[i + 4].Recovered, this.Countries[i + 5].Recovered, this.Countries[i + 6].Recovered], label: 'Daily Recovered' },
            { data: [this.Countries[i].Confirmed, this.Countries[i + 1].Confirmed, this.Countries[i + 2].Confirmed, this.Countries[i + 3].Confirmed, this.Countries[i + 4].Confirmed, this.Countries[i + 5].Confirmed, this.Countries[i + 6].Confirmed], label: 'Daily New Cases' }

          ]

        }
      }
    );
  }

  getdayone() {
    return this.CountryService.getdayOne(this.contrycode).subscribe(
      data => {
        this.Countriess = data;
      },
      err => console.error(err),
      () => {
        for (var key in this.Countriess) {
          this.Death.push(this.Countriess[key].Deaths)
          this.Recovered.push(this.Countriess[key].Recovered)
          this.Confirmed.push(this.Countriess[key].Confirmed)
        }
        console.log("logging deaths")
        console.log(this.Death);
        this.lineChartData = [
          { data: this.Death, label: 'Total Deaths' },
          { data: this.Recovered, label: 'Total Recovered' },
          { data: this.Confirmed, label: 'Total Cases' }
        ]
      }
    );
  }



}
