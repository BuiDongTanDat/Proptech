import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { CheckTag } from '../../../../shared/components/check-tag/check-tag';

@Component({
  selector: 'app-properties-sidebar',
  standalone: true,
  imports: [
    CustomInput,
    Button,
    CheckTag
  ],
  templateUrl: './properties-sidebar.html',
  styleUrl: './properties-sidebar.css',
})
export class PropertiesSidebar {
  @Input() filters: any;
  @Input() typologies: string[] = [];
  @Input() coreAttributes: any[] = [];

  @Output() toggleTypology = new EventEmitter<string>();
  @Output() toggleAttribute = new EventEmitter<any>();
  @Output() filtersChange = new EventEmitter<any>();


  onLocationChange(value: string) {
    this.filters.location = value;
    this.filtersChange.emit(this.filters);
  }


  onToggleTypology(type: string) {
    this.toggleTypology.emit(type);
  }

  onToggleAttribute(attr: any) {
    this.toggleAttribute.emit(attr);
  }
}
