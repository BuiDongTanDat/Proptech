import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { ContactForm } from '../contact-form/contact-form';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

import { IContact } from '../../../../core/models/model';
import { ContactsStore } from '../../../../core/stores/contacts.store';
import { Loading } from '../../../../shared/components/loading/loading';
import { getContactStatusClass } from '../../../../shared/utils/helper';
import { ContactStatus } from '../../../../core/enum/enums';
import { DATE_SORT_OPTIONS } from '../../../../core/constants/general.constant';
import { CONTACT_STATUS_OPTIONS } from '../../../../core/constants/contact.constant';

@Component({
  selector: 'app-contact-list-page',
  imports: [
    CommonModule, FormsModule, LucideDynamicIcon, Pagination,
    Button, CustomInput, Dropdown, ContactForm, Dialog, ConfirmDialog, Loading,
  ],
  templateUrl: './contact-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()'
  }
})

export class ContactListPage implements OnInit {
  protected readonly store = inject(ContactsStore);

  isListView = signal(false);
  isMobile = signal(false);
  showFormDialog = signal(false);
  showDeleteConfirm = signal(false);
  formMode = signal<'view' | 'edit' | 'add'>('view');
  selectedContact = signal<IContact | null>(null);

  sortOptions = DATE_SORT_OPTIONS;
  contactStatusOptions = CONTACT_STATUS_OPTIONS;

  ngOnInit(): void {
    this.onResize();
    this.store.loadContacts();
  }

  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  onSearch(val: string) {
    this.store.setSearch(val);
  }

  onSortChange(val: string) {
    this.store.setSort(val);
  }

  onStatusChange(val: string) {
    this.store.setStatus(val);
  }

  onPageChange(page: number) {
    this.store.setPage(page);
  }

  setListView(isList: boolean) {
    this.isListView.set(isList);
  }

  onAdd() {
    this.formMode.set('add');
    this.selectedContact.set(null);
    this.showFormDialog.set(true);
  }

  onEdit(contact: IContact) {
    this.formMode.set('edit');
    this.selectedContact.set(contact);
    this.showFormDialog.set(true);
  }

  onDelete(contact: IContact | null) {
    this.selectedContact.set(contact);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    const contact = this.selectedContact();
    if (contact?._id) {
      this.store.removeContact(contact._id);
    }
    this.showDeleteConfirm.set(false);
    this.showFormDialog.set(false);
  }

  onSaveContact(contactData: any) {
    const action$ = this.formMode() === 'add'
      ? this.store.addContact(contactData)
      : this.store.updateContact({ ...this.selectedContact()!, ...contactData });

    action$?.subscribe({
      next: () => {
        this.showFormDialog.set(false);
        this.selectedContact.set(null);
      },
      error: () => {
        // Error toast is handled inside the store.
      },
    });
  }

  onView(contact: IContact) {
    this.formMode.set('view');
    this.selectedContact.set(contact);
    this.showFormDialog.set(true);
  }

  closeFormDialog() {
    this.showFormDialog.set(false);
    this.selectedContact.set(null);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  getContactStatusClass(status: ContactStatus): string {
    return getContactStatusClass(status);
  }
}

