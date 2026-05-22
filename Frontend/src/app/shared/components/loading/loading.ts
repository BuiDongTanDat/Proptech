import { Component } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-loading',
  imports: [
    LucideDynamicIcon
  ],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {}
