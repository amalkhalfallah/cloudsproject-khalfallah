import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Country } from '../models/Country';
import { SingleCountry } from '../models/SingleCountry';
import { news } from '../models/news';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable({
  providedIn: 'root'
})

export class CountryService {




  constructor(private firestore: AngularFirestore, private http: HttpClient, private route: Router) {

  }



  getPolicies() {
    return this.firestore.collection('countries').valueChanges();
  }

  createPolicy(Country: Country) {
    return this.firestore.collection('countries').doc(Country.CountryCode).set(Country);
  }

  updatePolicy(key: string, value: any) {
    this.firestore.collection('countries').doc(key).update(value);

  }




  getnews() {
    return this.firestore.collection('news').valueChanges();
  }

  addnews(news: news) {
    return this.firestore.collection('news').add(news)
  }




  deletePolicy(CountryCode: string) {
    this.firestore.doc('countries/' + CountryCode).delete();
  }

  search(id: string) {
    return this.firestore.collection('countries').doc(id).valueChanges()
    /* db.collection('users').doc(id).get()
         .then(snapshot => setUserDetails(snapshot.data()))*/
  }


  getTotalydate(country: string, from: string, to: string): Observable<SingleCountry[]> {
    {

      return this.http.get<SingleCountry[]>('https://api.covid19api.com/country/' + country + '?from=' + from + '&to=' + to, httpOptions);

    }
  }


  getdayOne(country: string): Observable<SingleCountry[]> {
    {

      return this.http.get<SingleCountry[]>('https://api.covid19api.com/dayone/country/' + country, httpOptions);

    }
  }




}
