import { Component, Output, EventEmitter } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from "../../../shared/components/ui/custom-input/custom-input";

@Component({
  selector: 'app-admin-header',
  
  imports: [
    LucideDynamicIcon,
    CustomInput
], 
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {
  @Output() toggleSidebar = new EventEmitter<void>();
}
