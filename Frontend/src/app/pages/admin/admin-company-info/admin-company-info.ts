import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../shared/components/ui/button/button';

@Component({
  selector: 'app-admin-company-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideDynamicIcon,
    Button,
    CustomInput,
  ],
  templateUrl: './admin-company-info.html',
  styleUrl: './admin-company-info.css',
})
export class AdminCompanyInfo {
  isEditing = false;

  company = {
    companyName: 'Tan Realty',
    email: 'contact@tanrealty.vn',
    phone: '0901234567',
    website: 'https://tanrealty.vn',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    taxCode: '0312345678',
    description:
      'Tan Realty chuyên tư vấn, môi giới và phân phối các dự án bất động sản cao cấp.',
  };

  tempCompany = { ...this.company };

  onEdit() {
    this.isEditing = true;
    this.tempCompany = { ...this.company };
  }

  onCancel() {
    this.isEditing = false;
    this.tempCompany = { ...this.company };
  }

  onSave() {
    this.company = { ...this.tempCompany };
    this.isEditing = false;
  }
}