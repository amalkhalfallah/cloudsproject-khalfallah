import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from 'src/app/Services/auth.service';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnInit {
  Users: User[];
  email: string;
  userleg: boolean = false;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.getallusers()


  }



  getallusers() {
    return this.auth.getuserleg().subscribe((User: User[]) => {
      this.Users = User;
      () => {
        this.auth.user$.pipe(
          take(1),
          map(user => {
            this.email = user.email
          }))
        for (let u of this.Users) {
          if (u.email == this.email) {
            this.userleg = true
          }
        }
      }
    });


  }



  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.auth.user$.pipe(
      take(1),
      map(user => !!user && this.userleg), // <-- map to boolean
      tap(loggedIn => {
        if (!loggedIn) {
          console.log('access denied')
          this.router.navigate(['/home']);
        }
      })
    )
  }
}