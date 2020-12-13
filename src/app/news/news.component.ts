import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/Country';
import { WorldwideService } from 'src/app/Services/worldwide.service';
import { CountryService } from '../services/country.service';
import { news } from 'src/app/models/news';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';



@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  Countries: Country[];
  private newss
  news: news[];
  new: news = {
    country: "",
    newss: ""
  }






  constructor(public auth: AuthService, private WorldwideService: WorldwideService, private CountryService: CountryService) { }


  ngOnInit() {
    this.getnews();
    this.getallcountries();


  }


  newsForm = new FormGroup({
    country: new FormControl(''),
    news: new FormControl('')
  });


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



  getnews() {
    return this.CountryService.getnews().subscribe(
      data => {
        this.newss = data;
      },
      err => console.error(err),
      () => { }
    );
  }




  addnews() {
    this.new.country = this.newsForm.value.country,
      this.new.newss = this.newsForm.value.news
    this.CountryService.addnews(this.new);
    this.newsForm.reset();


  }



}
