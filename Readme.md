# Angular-Tour-of-Heroes
Angular demonstration [Tour of Heroes](https://angular.io/tutorial)

### Preparation before starting
* GitHub Markdown cheetsheet -> [cheetsheet](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf)
* VSCode Extentions -> Angular Language Service, Angularj Snippets, Angular 10 Snippets, Angular Essentials

The completion codes and app demonstration can be seen with [Stackblitz](https://stackblitz.com/angular/pyrgjeodnnl?file=src%2Fapp%2Fhero.service.ts)

# Start

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

