import {animate, state, style, transition, trigger} from "@angular/animations";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, Input} from '@angular/core';
import {Article} from "../../interfaces/news-interface";
import {NewsCardComponent} from "../news-card/news-card.component";

@Component({
  selector: 'app-news-cards',
  standalone: true,
  imports: [
    NewsCardComponent,
    NgForOf,
    NgIf,
    JsonPipe
  ],
  templateUrl: './news-cards.component.html',
  styleUrl: './news-cards.component.css',
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(200)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(400, style({opacity: 0})))
    ])
  ]
})
export class NewsCardsComponent {
  @Input({required: true}) articles: Article[] = [];
}
