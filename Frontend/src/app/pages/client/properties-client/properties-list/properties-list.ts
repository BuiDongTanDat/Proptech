import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from "../../../../shared/components/ui/button/button";
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [
    RouterLink,
    Button,
    LucideDynamicIcon
],
  templateUrl: './properties-list.html',
  styleUrl: './properties-list.css',
})
export class PropertiesList {
  @Input() properties: any[] = [];
}
