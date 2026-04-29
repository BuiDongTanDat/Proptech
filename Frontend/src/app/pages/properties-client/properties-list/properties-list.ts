import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './properties-list.html',
  styleUrl: './properties-list.css',
})
export class PropertiesList {
  @Input() properties: any[] = [];
}
