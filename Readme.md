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
ng generate service hero # Create new service ts file
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

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }
}
```



