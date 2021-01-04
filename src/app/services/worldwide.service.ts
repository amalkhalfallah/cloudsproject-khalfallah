import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Global } from 'src/app/models/Global';
import { Country } from '../models/Country';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';









const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable({
  providedIn: 'root'
})
export class WorldwideService {


  constructor(private http: HttpClient, private route: Router, private afAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  getGlobal(): Observable<Global> {
    {

      return this.http.get<Global>('https://api.covid19api.com/summary', httpOptions);

    }
  }

  getCountries(): Observable<Country[]> {
    {

      return this.http.get<Country[]>('https://api.covid19api.com/summary', httpOptions);

    }
  }

  getTotalydate(from: string, to: string): Observable<Country[]> {
    {

      return this.http.get<Country[]>('https://api.covid19api.com/world?from=' + from + '&to=' + to, httpOptions);

    }
  }

  getalldays(): Observable<any> {
    var currentDate = new Date();
    var pipe = new DatePipe('en-US')
    var to = pipe.transform(currentDate, 'yyyy-MM-dd')
    const url = "https://api.covid19api.com/world?from=2020-03-01T00:00:00Z&to=" + to + 'T00:00:00Z'
    return this.http.get<any>(url);

  }


}

