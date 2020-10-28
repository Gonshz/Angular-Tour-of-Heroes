import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component'; //Somewhere to go once you configure the routes.
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

// Attach /heroes path the component HeroesComponent
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent }
];

// Initialize the router nad start listening browser url
@NgModule({
  imports: [RouterModule.forRoot(routes)], //forRoot means that the router is being at the app root level
  exports: [RouterModule] // It will be available throughout the app
})
export class AppRoutingModule { }

//ng generate command, especially --modelu==app flag, automatically adds AppRoutingModule to app.modules.ts file.
