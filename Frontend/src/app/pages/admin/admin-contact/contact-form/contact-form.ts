import { Component, input, output, signal, effect, inject } from '@angular/core';
import { ContactsStore } from '../../../../core/stores/contacts.store';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { CONTACT_STATUS_OPTIONS } from '../../../../core/constants/contact.constant';
import { CustomTextarea } from "../../../../shared/components/ui/custom-textarea/custom-textarea";

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInput,
    Button,
    LucideDynamicIcon,
    Dropdown,
    CustomTextarea
],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  store = inject(ContactsStore);

  // Add statusOptions for dropdown
  readonly statusOptions = CONTACT_STATUS_OPTIONS

  contactModal = input<any>();
  mode = input<'view' | 'edit' | 'add'>('view');
  close = output<void>();
  save = output<any>();
  delete = output<void>();

  currentMode = signal<'view' | 'edit' | 'add'>('view');
  submitted: boolean = false;

  contactForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    status: new FormControl('Mới', Validators.required),
  });

  get f() {
    return this.contactForm.controls;
  }

  constructor() {
    effect(() => {
      const mode = this.mode();
      const contactModal = this.contactModal();

      this.currentMode.set(mode); 
      
      this.submitted = false;

      if (contactModal) {
        this.contactForm.patchValue(contactModal);
      } else {
        this.contactForm.reset({ status: 'Mới' });
      }

      if (mode === 'view') {
        this.contactForm.disable();
      } else {
        this.contactForm.enable();
      }
    });
  }

  onEdit() {
    this.currentMode.set('edit');
    this.contactForm.enable();
  }

  onCancel() {
    if (this.currentMode() === 'edit' && this.contactModal()) {
      this.contactForm.patchValue(this.contactModal());
      this.contactForm.disable();
      this.currentMode.set('view');
    } else {
      this.close.emit();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      console.log('Form invalid:', this.contactForm.errors);
      return;
    }
    this.save.emit(this.contactForm.value);
  }

  onDelete() {
    this.delete.emit();
  }

  onClose() {
    this.close.emit();
  }
}