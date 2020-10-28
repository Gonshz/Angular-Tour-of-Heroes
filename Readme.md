# Angular-Tour-of-Heroes
Angular demonstration [Tour of Heroes](https://angular.io/tutorial)

### Preparation before starting
* GitHub Markdown cheetsheet -> [cheetsheet](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf)
* VSCode Extentions -> Angular Language Service, Angularj Snippets, Angular 10 Snippets, Angular Essentials

The completion codes and app demonstration can be seen with [Stackblitz](https://stackblitz.com/angular/pyrgjeodnnl?file=src%2Fapp%2Fhero.service.ts)

# Key Concepts

### Setup
Install command
``` 
npm install -g @angular/cli
```
Initial commands to run the default angular app
```
ng new angular-tour-of-heroes
ng serve --open
```
Other commands
```
ng generate component heroes  #Create new component named heroes
ng generate service hero #Create new service ts file

ng generate module app-routing --flat --module=app #Generate app-routing.module.ts
#--flat puts the file in src/app instead of its own folder.
#--module=app tells the CLI to register it in the imports array of the AppModule. That means app.modules.ts automatically imports AppRoutingModule and you can use <router-outlet></router-outlet> or other things.
```

## Two way binding
Add FormsModule, and use ngModel to use two way data binding.

app.modules.ts 
```ts
import { FormsModule } from '@angular/forms';

[...]

@NgModule({
  imports: [
    [...]
    FormsModule
  ],
  [...]
})
```
heroes.component.html
```html
<div>
  <label>name:
    <input [(ngModel)]="hero.name" placeholder="name"/>
  </label>
</div>
```

## Undefined property when app starts

heroes.component.ts
```ts
selectedHero: Hero;
onSelect(hero: Hero): void {
  this.selectedHero = hero;
}
```
This selectedHero is not defined when the app starts. To avoid an error, add *ngIf.
The ngIf removes the hero detail from the DOM.

heroes.component.html
```html
<div *ngIf="selectedHero">

  <h2>{{selectedHero.name | uppercase}} Details</h2>
  <div><span>id: </span>{{selectedHero.id}}</div>
  <div>
    <label>name:
      <input [(ngModel)]="selectedHero.name" placeholder="name"/>
    </label>
  </div>

</div>
```

## One way data binding
To pass a data object named hero, receiver should do @Input().

heroes.component.html
```html
<app-hero-detail [hero]="selectedHero"></app-hero-detail>
```
hero-detail.component.ts
```ts
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;
}
```

## Service
Angular's dependency injection system. 

![service injection](https://miro.medium.com/max/702/1*8z1wpB1XWJKqwx3jLL_iCQ.png)

hero.service.ts
```ts
import { Injectable } from '@angular/core';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor() { }

  getHeroes(): Hero[] {
    return HEROES;
  }
}
```
Guide of [dependency injection](https://angular.io/guide/dependency-injection) and [Providing](https://angular.io/guide/providers).

## Observable data
The app will fetch heroes from a remote server, which is an inherently asynchronous operation.

[RxJS](https://rxjs-dev.firebaseapp.com/guide/overview) library has classes of observable.

hero.service.ts
```ts
import { Observable, of } from 'rxjs';
export class HeroService {
  getHeroes(): Observable<Hero[]> {
    return of(HEROES);
  }
  
  //The below line is synchronous declaration. Do not do that.
  // this.heroes = this.heroService.getHeroes();
}
```
heroes.component.ts
```ts
getHeroes(): void {
  this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
}
// Below lines are synchronous decralation.
//getHeroes(): void {
//  this.heroes = this.heroService.getHeroes();
//}
```
The subscribe() method passes the emitted array to the callback, which sets the component's heroes property.

What if you want to put message.service.ts to hero.service.ts?

message.service.ts
```
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}
```

heroes.component.ts
```ts
import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service'; // Import message.service.ts


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  selectedHero: Hero;

  heroes: Hero[];
  
  // You have to include what you imported to constructor.
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  // When this component is called, getHeroes() method starts.
  ngOnInit() {
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  // Observable.subscribe method gives observable data from here.service.ts.
  getHeroes(): void {
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }
}
```

hero.service.ts
```ts
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs'; // Observable key library

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  constructor(private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> { // RxJS method Observable, and it has .subscribe method
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }
}
```

## Routing
> In Angular, the best practice is to load and configure the router in a separate, top-level module that is dedicated to routing and imported by the root AppModule.
> By convention, the module class name is AppRoutingModule and it belongs in the app-routing.module.ts in the src/app folder.

```
ng generate module app-routing --flat --module=app #Generate app-routing.module.ts
```

app-routing.modele.ts
```ts
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
```
app.component.html
```html
<h1>{{title}}</h1>
<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
</nav>
<!-- router-outlet displays component when the url matches to component's one. -->
<router-outlet></router-outlet>
<app-messages></app-messages>
```

hero.service.ts
```ts
  getHero(id: number): Observable<Hero> { // RxJS method Observable, and it has .subscribe method
    // TODO: send the message _after_ fetching the hero
    this.messageService.add(`HeroService: fetched hero id=${id}`); // Pass id as a param to hero-detail.component.ts
    return of(HEROES.find(hero => hero.id === id));
  }
  ```
  hero-detail.component.ts
  ```ts
  import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router'; //Hold info of the route of this hero-detail instance
import { Location } from '@angular/common';

import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    //route.snapshot is a static image of the route info
    //paramMap is a dictionary of the route param values extracted from url
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

}
```


## Server
HttpClient is Angular's mechanism for communicating with a remote server over HTTP.

app.module.ts
```ts
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [
    HttpClientModule,
  ],
})
```

hero.service.ts
```ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    // HttpClient methods return only one value, while RxJS observable methods return multiple
    // HttpClient.get() returns the body of the response as an untyped JSON object
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
    // return of(HEROS); RxJS method
  }
  private handleError<T>(operation = 'operation', result?: T) {
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> { // RxJS method Observable, and it has .subscribe method
    const url = `${this.heroesUrl}/${id}`; // Pass id as a param to hero-detail.component.ts
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * The HttpClient.put() method takes three parameters:
   * the URL
   * the data to update (the modified hero in this case)
   * options */


  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
}
```
Erro handler, update, add, ..., hero.service.ts is the core of this app.

## Search
hero.service.ts
```ts
  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
          this.log(`found heroes matching "${term}"`) :
          this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
  ```
  hero-search.component.html
  ```html
<div id="search-component">
  <h4><label for="search-box">Hero Search</label></h4>

  <input #searchBox id="search-box" (input)="search(searchBox.value)" />

  <ul class="search-result">
    <!-- $ is the convention, indicates heroes$ is an Observable, not an array -->
    <li *ngFor="let hero of heroes$ | async" >
      <a routerLink="/detail/{{hero.id}}">
        {{hero.name}}
      </a>
    </li>
  </ul>
</div>
```
hero-seach.component.ts
```ts
import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.scss' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  // Subject is both a source of observable values and an Observable itself
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}
```



