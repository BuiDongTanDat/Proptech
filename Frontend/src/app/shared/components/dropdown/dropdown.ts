import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  TemplateRef,
  ViewChild,
  AfterViewChecked,
  AfterViewInit,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { OverlayModule, Overlay, CdkConnectedOverlay } from '@angular/cdk/overlay';
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
export class Dropdown implements ControlValueAccessor, AfterViewChecked, AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild(CdkConnectedOverlay) connectedOverlay?: CdkConnectedOverlay;

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
  private readonly overlay = inject(Overlay);
  readonly scrollStrategy = this.overlay.scrollStrategies.reposition();
  
  // State
  readonly isOpen = signal(false);
  readonly search = signal('');
  readonly triggerWidth = signal(0);

  // Quản lý giá trị bằng Signal để đảm bảo OnPush hoạt động chuẩn xác
  readonly selectedValue = signal<unknown>(null);
  readonly disabledState = signal(false);
  private readonly triggerButton = signal<HTMLElement | null>(null);
  private readonly handleViewportChange = () => {
    if (!this.isOpen()) return;
    this.updateTriggerWidth();
    this.connectedOverlay?.overlayRef?.updatePosition();
  };

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

  ngAfterViewInit(): void {
    const btn = this.elRef.nativeElement.querySelector('button') as HTMLElement | null;
    this.triggerButton.set(btn);
    document.addEventListener('scroll', this.handleViewportChange, true);
    window.addEventListener('resize', this.handleViewportChange);
  }

  ngAfterViewChecked(): void {
    if (this.isOpen() && this.searchable() && this.searchInput?.nativeElement) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('scroll', this.handleViewportChange, true);
    window.removeEventListener('resize', this.handleViewportChange);
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
    this.updateTriggerWidth();
    this.isOpen.update(v => !v);

    // Ensure overlay is synced with the trigger right after opening.
    if (!this.isOpen()) return;
    setTimeout(() => {
      this.handleViewportChange();
    }, 0);
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

  private updateTriggerWidth(): void {
    const btn = this.triggerButton() ?? (this.elRef.nativeElement.querySelector('button') as HTMLElement | null);
    const width = btn?.getBoundingClientRect().width ?? btn?.offsetWidth ?? 0;
    this.triggerWidth.set(width);
  }
}