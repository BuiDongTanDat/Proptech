

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';

@Component({
  selector: 'app-properties-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    CustomInput,
  ],
  templateUrl: './properties-sidebar.html',
  styleUrl: './properties-sidebar.css',
})
export class PropertiesSidebar {

  @Input() filters: any;
  @Input() categories: any[] = [];
  @Input() selectedCategory: string = 'all';
  @Output() locationChange = new EventEmitter<string>();
  @Output() developerChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();

  onLocationChange(value: string) {
    this.locationChange.emit(value);
  }

  onDeveloperChange(value: string) {
    this.developerChange.emit(value);
  }

  onCategoryChange(value: string) {
    this.categoryChange.emit(value);
  }
}
