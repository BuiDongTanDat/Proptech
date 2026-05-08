import { Component } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Button } from '../../../shared/components/ui/button/button';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';

@Component({
  selector: 'app-admin-setting',
  imports: [
    LucideDynamicIcon,
    Button,
    CustomInput
  ],
  templateUrl: './admin-setting.html',
  styleUrl: './admin-setting.css',
})
export class AdminSetting {
  activeTab: 'general' | 'account' | 'security' = 'general';

  setTab(tab: 'general' | 'account' | 'security') {
    this.activeTab = tab;
  }
}
