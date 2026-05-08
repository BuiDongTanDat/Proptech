import { Component } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Button } from '../../../shared/components/ui/button/button';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    LucideDynamicIcon,
    Button,
    CustomInput
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {}
