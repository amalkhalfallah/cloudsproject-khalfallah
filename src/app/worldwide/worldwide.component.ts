import { Component, OnInit, ViewChild } from '@angular/core';
import { WorldwideService } from 'src/app/Services/worldwide.service';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { Global } from 'src/app/models/Global';
import { Country } from 'src/app/models/Country';
import { DatePipe } from '@angular/common';
import { User } from '../models/user';
import { news } from 'src/app/models/news';
import { CountryService } from '../services/country.service';





@Component({
  selector: 'app-worldwide',
  templateUrl: './worldwide.component.html',
  styleUrls: ['./worldwide.component.css'],
  providers: [DatePipe]
})
export class WorldwideComponent implements OnInit {
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  Global: Global = {
    Global: {
      NewConfirmed: 0,
      TotalConfirmed: 0,
      NewDeaths: 0,
      TotalDeaths: 0,
      NewRecovered: 0,
      TotalRecovered: 0,
      MortalityRate: 0,
      RecoveryRate: 0,
      ActiveCases: 0
    }
  }

  Countries: Country[];
  Countriess: Country[];
  Death: Array<number> = []
  Recovered: Array<number> = []
  Confirmed: Array<number> = []



  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], 'Active Cases'];;
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';

  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: ['#ED97AB', '#87C7F3', '#FDE29D']
    },
  ];

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
  private user = null;





  myDate = new Date();
  private today;
  private seven
  constructor(private WorldwideService: WorldwideService, private datePipe: DatePipe, private CountryService: CountryService) {
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
    this.getGlobal();
    this.getallcountries();
    this.getagetTotalydate();
    this.getagetTotalApril();


  }



  getGlobal() {
    return this.WorldwideService.getGlobal().subscribe(
      data => {
        this.Global = data;
      },
      err => console.error(err),
      () => {
        this.pieChartData = [this.Global.Global.TotalDeaths, this.Global.Global.TotalRecovered, this.Global.Global.TotalConfirmed - this.Global.Global.TotalRecovered]
      }
    );
  }

  getallcountries() {
    return this.WorldwideService.getCountries().subscribe(
      data => {
        this.Countries = data;
      },
      err => console.error(err),
      () => {
      }
    );
  }

  getagetTotalydate() {
    return this.WorldwideService.getTotalydate(this.seven, this.today).subscribe(
      data => {
        this.Countries = data;
      },
      err => console.error(err),
      () => {
        for (let i = 0; i <= this.Countries.length; i++) {
          this.barChartData = [
            { data: [this.Countries[i].NewDeaths, this.Countries[i + 1].NewDeaths, this.Countries[i + 2].NewDeaths, this.Countries[i + 3].NewDeaths, this.Countries[i + 4].NewDeaths, this.Countries[i + 5].NewDeaths, this.Countries[i + 6].NewDeaths], label: 'Daily Deaths' },
            { data: [this.Countries[i].NewRecovered, this.Countries[i + 1].NewRecovered, this.Countries[i + 2].NewRecovered, this.Countries[i + 3].NewRecovered, this.Countries[i + 4].NewRecovered, this.Countries[i + 5].NewRecovered, this.Countries[i + 6].NewRecovered], label: 'Daily Recovered' },
            { data: [this.Countries[i].NewConfirmed, this.Countries[i + 1].NewConfirmed, this.Countries[i + 2].NewConfirmed, this.Countries[i + 3].NewConfirmed, this.Countries[i + 4].NewConfirmed, this.Countries[i + 5].NewConfirmed, this.Countries[i + 6].NewConfirmed], label: 'Daily New Cases' }
          ]

        }
      }
    );
  }

  getagetTotalApril() {
    return this.WorldwideService.getTotalydate('2020-04-13', this.today).subscribe(
      data => {
        this.Countriess = data;
      },
      err => console.error(err),
      () => {
        for (var key in this.Countriess) {
          this.Death.push(this.Countriess[key].TotalDeaths)
          this.Recovered.push(this.Countriess[key].TotalRecovered)
          this.Confirmed.push(this.Countriess[key].TotalConfirmed)
        }
        console.log(this.Death)
        this.lineChartData = [
          { data: this.Death, label: 'Total Deaths' },
          { data: this.Recovered, label: 'Total Recovered' },
          { data: this.Confirmed, label: 'Total Cases' }
        ]
      }
    );
  }
}











