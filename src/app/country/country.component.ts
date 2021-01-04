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
  Dates: Array<string> = []
  boo: boolean = false;

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
  public pieChartColors = [
    {
      backgroundColor: ['#ED97AB', '#87C7F3', '#FDE29D']
    },
  ];

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };






  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];




  public lineChartData: ChartDataSets[] = [];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartLabels: Label[] = [];

  constructor(private ar: ActivatedRoute, private CountryService: CountryService, private route: Router, private datePipe: DatePipe) {
    this.ar.paramMap.subscribe(res => this.contrycode = (res.get('id')));
    this.ar.paramMap.subscribe(res => this.Country = Object(this.route.getCurrentNavigation().extras.state));
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();




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

    this.barChartLabels = this.betweendates()

    this.barChartData = [
      { data: this.TotalDeathsseven(), label: 'Daily Deaths' },
      { data: this.getTotalRecoveredseven(), label: 'Daily Recovered' },
      { data: this.getConfirmedTotalseven(), label: 'Daily New Cases' }
    ]
  }

  getdayone() {

    this.lineChartLabels = this.totalbetweendates()
    this.lineChartData = [
      { data: this.TotalDeaths(), label: 'Total Deaths' },
      { data: this.getTotalRecovered(), label: 'Total Recovered' },
      { data: this.getConfirmedTotal(), label: 'Total Cases' }
    ]

  }


  getConfirmedTotal() {
    var cleandata = []
    this.CountryService.getdayOne(this.contrycode).subscribe((data) => {
      cleandata.push(data[0]['Confirmed'])
      for (let i = 1; i <= data.length; i++) {
        cleandata.push(cleandata[i - 1] + data[i]['Confirmed'])
      }
    }
    )
    return cleandata
  }
  getTotalRecovered() {
    var cleandata = []
    this.CountryService.getdayOne(this.contrycode).subscribe((data) => {
      cleandata.push(data[0]['Recovered'])
      for (let i = 1; i <= data.length; i++) {
        cleandata.push(cleandata[i - 1] + data[i]['Recovered'])
      }
    }
    )
    return cleandata
  }

  TotalDeaths() {
    var cleandata = []
    this.CountryService.getdayOne(this.contrycode).subscribe((data) => {
      cleandata.push(data[0]['Deaths'])
      for (let i = 1; i <= data.length; i++) {
        cleandata.push(cleandata[i - 1] + data[i]['Deaths'])
      }
    }
    )
    console.log("printing deaths")
    console.log(cleandata)
    return cleandata
  }

  TotalDeathsseven() {
    var cleandata = []
    this.CountryService.getdayOne(this.contrycode).subscribe((data) => {
      for (let i = data.length - 7; i < data.length; i++) {
        cleandata.push(data[i]['Deaths'])
      }
    }
    )
    console.log("printing deaths from seven")
    console.log(cleandata)
    return cleandata
  }

  betweendates() {
    var tab = []
    this.CountryService.getdayOne(this.contrycode).subscribe((data) => {
      for (let i = data.length - 7; i < data.length; i++) {
        var currentDate = new Date(data[0]['Date']);
        var pastDate = new Date(data[0]['Date']);
        var pipe = new DatePipe('en-US')
        pastDate.setDate(currentDate.getDate() + i);
        var from = pipe.transform(pastDate, 'dd-MMM')
        tab.push(from)
      }
    })
    return tab


  }

  totalbetweendates() {
    var tab = []
    this.CountryService.getdayOne(this.contrycode).subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        var currentDate = new Date(data[0]['Date']);
        var pastDate = new Date(data[0]['Date']);
        var pipe = new DatePipe('en-US')
        pastDate.setDate(currentDate.getDate() + i);
        var from = pipe.transform(pastDate, 'dd-MMM')
        tab.push(from)
      }
    })
    console.log("printingtab")
    console.log(tab)
    return tab


  }
  getTotalRecoveredseven() {
    var cleandata = []
    this.CountryService.getdayOne(this.contrycode).subscribe((data) => {
      for (let i = data.length - 7; i < data.length; i++) {
        cleandata.push(data[i]['Recovered'])
      }
    }
    )
    return cleandata
  }

  getConfirmedTotalseven() {
    var cleandata = []
    this.CountryService.getdayOne(this.contrycode).subscribe((data) => {
      for (let i = data.length - 7; i < data.length; i++) {
        cleandata.push(data[i]['Confirmed'])
      }
    }
    )
    return cleandata
  }

}



