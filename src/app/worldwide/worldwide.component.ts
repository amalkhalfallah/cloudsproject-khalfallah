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




declare function Sorttable()


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

  Countries: Country[] = [];
  public AllCountries
  Countriess: Country[];




  public pieChartLabels: Label[] = [['Dead Cases'], ['Recovered Cases'], 'Active Cases'];;
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';

  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: ['#ED97AB', '#87C7F3', '#FDE29D']
    },
  ];



  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  barChartData: ChartDataSets[] = [];



  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = [];
  lineChartOptions: ChartOptions = {
    responsive: true
  };
  lineChartType = 'line';
  private user = null;





  myDate = new Date();
  constructor(private WorldwideService: WorldwideService, private datePipe: DatePipe, private CountryService: CountryService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend()

  }



  ngOnInit() {
    this.getGlobal();
    this.getallcountries();
    this.getagetTotalydate();
    this.getagetTotalApril();

  }

  Sorttable() {
    Sorttable()
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
        this.AllCountries = data;
      },
      err => console.error(err),
      () => {
      }
    );
  }

  getagetTotalydate() {
    return this.WorldwideService.getalldays().subscribe(
      data => {
        this.Countries = data;
      },
      err => console.error(err),
      () => {
        this.barChartLabels = this.betweendates()
        for (let i = this.Countries.length - 7; i < this.Countries.length; i++) {
          this.barChartData = [
            { data: [this.Countries[i].NewDeaths, this.Countries[i + 1].NewDeaths, this.Countries[i + 2].NewDeaths, this.Countries[i + 3].NewDeaths, this.Countries[i + 4].NewDeaths, this.Countries[i + 5].NewDeaths, this.Countries[i + 6].NewDeaths], label: 'Daily Deaths' },
            { data: [this.Countries[i].NewRecovered, this.Countries[i + 1].NewRecovered, this.Countries[i + 2].NewRecovered, this.Countries[i + 3].NewRecovered, this.Countries[i + 4].NewRecovered, this.Countries[i + 5].NewRecovered, this.Countries[i + 6].NewRecovered], label: 'Daily Recovered' },
            { data: [this.Countries[i].NewConfirmed, this.Countries[i + 1].NewConfirmed, this.Countries[i + 2].NewConfirmed, this.Countries[i + 3].NewConfirmed, this.Countries[i + 4].NewConfirmed, this.Countries[i + 5].NewConfirmed, this.Countries[i + 6].NewConfirmed], label: 'Daily New Cases' }
          ]

        }
      }
    );
  }

  getalldaysfromapril() {
    var tab = []
    this.WorldwideService.getalldays().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        var currentDate = new Date("2020-04-13T00:00:00");
        var pastDate = new Date("2020-04-13T00:00:00");
        var pipe = new DatePipe('en-US')
        pastDate.setDate(currentDate.getDate() + i);
        var from = pipe.transform(pastDate, 'dd-MMM')
        tab.push(from)
      }
    })
    return tab
  }


  betweendates() {
    var tab = []
    this.WorldwideService.getalldays().subscribe((data) => {
      for (let i = data.length - 7; i < data.length; i++) {
        var currentDate = new Date("2020-04-13T00:00:00");
        var pastDate = new Date("2020-04-13T00:00:00");
        var pipe = new DatePipe('en-US')
        pastDate.setDate(currentDate.getDate() + i);
        var from = pipe.transform(pastDate, 'dd-MMM')
        tab.push(from)
      }
    })
    return tab


  }


  getagetTotalApril() {


    this.lineChartLabels = this.getalldaysfromapril()
    this.lineChartData = [
      { data: this.TotalDeaths(), label: 'Total Deaths' },
      { data: this.getTotalRecovered(), label: 'Total Recovered' },
      { data: this.getConfirmedTotal(), label: 'Total Cases' }
    ]

  }
  getConfirmedTotal() {
    var cleandata = []
    this.WorldwideService.getalldays().subscribe((data) => {
      cleandata.push(data[0]['TotalConfirmed'])
      for (let i = 1; i < data.length; i++) {
        cleandata.push(cleandata[i - 1] + data[i]['TotalConfirmed'])
      }
    }
    )
    return cleandata
  }
  getTotalRecovered() {
    var cleandata = []
    this.WorldwideService.getalldays().subscribe((data) => {
      cleandata.push(data[0]['TotalRecovered'])
      for (let i = 1; i < data.length; i++) {
        cleandata.push(cleandata[i - 1] + data[i]['TotalRecovered'])
      }
    }
    )
    return cleandata
  }

  TotalDeaths() {
    var cleandata = []
    this.WorldwideService.getalldays().subscribe((data) => {
      cleandata.push(data[0]['TotalDeaths'])
      for (let i = 1; i < data.length; i++) {
        cleandata.push(cleandata[i - 1] + data[i]['TotalDeaths'])
      }
    }
    )
    return cleandata
  }








}











