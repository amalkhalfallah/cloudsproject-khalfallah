import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CountryComponent } from './country/country.component';
import { NewsComponent } from './news/news.component';
import { WorldwideComponent } from './worldwide/worldwide.component'


const routes: Routes = [
  { path: "home", component: WorldwideComponent },
  { path: "detail/:id", component: CountryComponent },
  { path: "news", component: NewsComponent },
  { path: "**", redirectTo: "home" }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
