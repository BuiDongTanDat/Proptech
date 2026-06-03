import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    LucideDynamicIcon,
    CustomInput,
    Dropdown
  ],
  templateUrl: './properties-list.html',
  styleUrl: './properties-list.css',
})
export class PropertiesList {
  @Input() properties: any[] = [];
  @Input() loading = false;
  @Input() location = '';
  @Input() developer = '';
  @Input() sortOptions: Array<{ label: string; value: string }> = [];
  @Input() selectedSort = 'newest';

  @Output() locationChange = new EventEmitter<string>();
  @Output() developerChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();
}
