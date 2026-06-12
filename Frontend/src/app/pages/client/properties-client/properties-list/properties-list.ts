import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';

import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { IPost } from '../../../../core/models/model';

@Component({
  selector: 'app-properties-list',
  imports: [
    FormsModule,
    RouterLink,
    LucideDynamicIcon,
    CustomInput,
    Button,
  ],
  templateUrl: './properties-list.html',
  styleUrl: './properties-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesList {
  readonly properties = input<IPost[]>([]);
  readonly loading = input(false);

  readonly keyword = input('');

  readonly keywordChange = output<string>();
  readonly search = output<void>();
}