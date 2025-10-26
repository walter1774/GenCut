import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  imports: [],
  template: 
  `
    <div class="error">
      <ng-content/>
    </div>
  `,
  styleUrl: './error.scss'
})
export class Error {

}
