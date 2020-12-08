import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/Country';
import { WorldwideService } from 'src/app/Services/worldwide.service';
import { CountryService } from '../services/country.service';
import { news } from 'src/app/models/news';
import { FormGroup, FormControl } from '@angular/forms';



@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  Countries: Country[];
  news: news[];
  new: news = {
    country: "",
    newss: ""
  }






  constructor(private WorldwideService: WorldwideService, private CountryService: CountryService) { }


  ngOnInit() {
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

  addnews() {
    this.new.country = this.newsForm.value.country,
      this.new.newss = this.newsForm.value.news
    this.CountryService.addnews(this.new);
    this.newsForm.reset();


  }



}
