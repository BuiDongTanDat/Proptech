import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  TemplateRef,
  ViewChild,
  AfterViewChecked,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { LucideDynamicIcon } from '@lucide/angular';
import { NgTemplateOutlet } from '@angular/common';

export interface DropdownOption<T = unknown> {
  label: string;
  value: T;
  [key: string]: unknown;
}

const MAX_VISIBLE = 8;     

@Component({
  selector: 'app-dropdown',
  imports: [FormsModule, OverlayModule, ScrollingModule, LucideDynamicIcon, NgTemplateOutlet],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: Dropdown, multi: true },
  ],
  host: {
    '(document:keydown.escape)': 'close()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class Dropdown implements ControlValueAccessor, AfterViewChecked {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  // Inputs   
  readonly options = input<DropdownOption[]>([]);
  readonly placeholder = input('Chọn');
  readonly searchable = input(false);
  readonly disabled = input(false);
  readonly className = input('');
  readonly itemSize = input<number>(36); // Tùy chính độ cao mỗi option
  readonly maxVisible = input<number>(MAX_VISIBLE); // Tùy chỉnh số lượng option hiển thị trước khi scroll xuất hiện

  /** Template tuỳ chỉnh cho mỗi option */
  @ContentChild(TemplateRef)
  optionTemplate?: TemplateRef<{ $implicit: DropdownOption; selected: boolean }>;

  // Refs
  private readonly elRef = inject(ElementRef<HTMLElement>);

  // State
  readonly isOpen = signal(false);
  readonly search = signal('');
  readonly triggerWidth = signal(0);
  
  // Quản lý giá trị bằng Signal để đảm bảo OnPush hoạt động chuẩn xác
  readonly selectedValue = signal<unknown>(null);
  readonly disabledState = signal(false);

  // Kết hợp trạng thái disable từ input và form control
  readonly isDisabled = computed(() => this.disabled() || this.disabledState());

  readonly filteredOptions = computed(() => {
    const kw = this.search().trim().toLowerCase();
    return kw
      ? this.options().filter(o => o.label.toLowerCase().includes(kw))
      : this.options();
  });

  readonly selectedLabel = computed(
    () => this.options().find(o => o.value === this.selectedValue())?.label ?? ''
  );

  readonly viewportHeight = computed(() => {
    const size = this.itemSize();
    const count = this.filteredOptions().length;
    return Math.min(count, this.maxVisible()) * size;
  });

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.search.set('');
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.isOpen() && this.searchable() && this.searchInput?.nativeElement) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 0);
    }
  }

  // ControlValueAccessor methods
  private onChange = (_: unknown) => { };
  private onTouched = () => { };

  writeValue(value: unknown): void { 
    this.selectedValue.set(value); 
  }
  
  registerOnChange(fn: (v: unknown) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
  
  // Đồng bộ trạng thái disable từ Reactive Forms
  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  toggle(): void {
    if (this.isDisabled()) return;
    const btn = this.elRef.nativeElement.querySelector('button') as HTMLElement;
    const width = btn?.getBoundingClientRect().width ?? btn?.offsetWidth ?? 0;
    this.triggerWidth.set(width);
    this.isOpen.update(v => !v);
  }

  close(): void { this.isOpen.set(false); }

  select(value: unknown): void {
    this.selectedValue.set(value);
    this.onChange(value);
    this.onTouched();
    this.close();
  }

  trackByValue(_: number, item: DropdownOption): unknown { return item.value; }

  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && this.searchable() && this.searchInput?.nativeElement) {
      if (this.searchInput.nativeElement.contains(event.target as Node)) return;
    }
    if (!this.elRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }
}