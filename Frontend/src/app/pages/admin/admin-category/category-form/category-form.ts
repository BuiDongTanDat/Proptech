
import { Component, input, output, signal, inject, effect } from '@angular/core';
import { CategoryStore } from '../../../../core/stores/category.store';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-category-form',
  // standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomInput, Button, LucideDynamicIcon],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  store = inject(CategoryStore);

  categoryModal = input<any>();
  mode = input<'view' | 'edit' | 'add'>('view');
  close = output<void>();
  save = output<any>();
  delete = output<void>();

  currentMode = signal<'view' | 'edit' | 'add'>('view');
  submitted: boolean = false;

  categoryForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  constructor() {
    effect((): void => {
      const mode = this.mode();
      const categoryModal = this.categoryModal();

      this.currentMode.set(mode);
      this.submitted = false;

      if (categoryModal) {
        this.categoryForm.patchValue({
          name: categoryModal.name,
        });
      } else {
        this.categoryForm.reset();
      }

      if (mode === 'view') {
        this.categoryForm.disable();
      } else {
        this.categoryForm.enable();
      }
    });
  }


  get f() {
    return this.categoryForm.controls;
  }

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.currentMode.set('edit');
    this.categoryForm.enable();
  }

  onCancel() {
    if (this.currentMode() === 'edit' && this.categoryModal()) {
      this.categoryForm.patchValue({
        name: this.categoryModal().name,
      });
      this.categoryForm.disable();
      this.currentMode.set('view');
    } else {
      this.close.emit();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.invalid) return;
    const data = {
      name: this.f.name.value,
      _id: this.categoryModal()?._id,
    };
    this.save.emit(data);
  }

  onDelete() {
    this.delete.emit();
  }
}
