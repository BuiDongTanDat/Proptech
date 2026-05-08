
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Property } from '../../../../shared/utils/data.mock';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-properties-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInput,
    Button,
    LucideDynamicIcon
  ],
  templateUrl: './properties-form.html',
  styleUrl: './properties-form.css',
})
export class PropertiesForm {
  @Input() property: Property | null = null;
  @Input() mode: 'view' | 'edit' | 'add' = 'view';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Property>();

  propertyForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    suites: new FormControl('', [Validators.required]),
    baths: new FormControl('', [Validators.required]),
    sqft: new FormControl('', [Validators.required]),
    architect: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    badge: new FormControl(''),
    typologies: new FormControl(''),
  });

  submitted = false;

  ngOnInit() {
    if (this.property && (this.mode === 'edit' || this.mode === 'view')) {
      this.propertyForm.patchValue({
        ...this.property,
        typologies: this.property.typologies?.join(', ')
      });
      if (this.mode === 'view') {
        this.propertyForm.disable();
      } else {
        this.propertyForm.enable();
      }
    } else if (this.mode === 'add') {
      this.propertyForm.reset();
      this.propertyForm.enable();
    }
  }

  get f() {
    return this.propertyForm.controls;
  }

  onSubmit() {
  this.submitted = true;

  if (this.propertyForm.invalid) return;

  const formValue = this.propertyForm.value;

  // const payload: Property = {
  //   id: this.property?.id ?? Date.now(),

  //   title: formValue.title!,
  //   price: String(formValue.price),
  //   location: formValue.location!,
  //   suites: Number(formValue.suites),
  //   baths: Number(formValue.baths),
  //   sqft: Number(formValue.sqft),
  //   architect: formValue.architect!,
  //   image: formValue.image!,
  //   badge: formValue.badge || '',

  //   typologies: formValue.typologies
  //     ? formValue.typologies
  //         .split(',')
  //         .map((t: string) => t.trim())
  //     : []
  // };

  // this.save.emit(payload);
  console.log('Form submitted with value:', formValue);
}

  onClose() {
    this.close.emit();
  }
}
