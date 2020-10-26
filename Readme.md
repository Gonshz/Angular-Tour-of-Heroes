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

*Two way binding
Add FormsModule, and use ngModel to use two way data binding.

app.modules.ts 
```javascript
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
```
<div>
  <label>name:
    <input [(ngModel)]="hero.name" placeholder="name"/>
  </label>
</div>
```
