import { Component, signal, viewChild } from '@angular/core';
import { Toast } from '../../shared/components/toast/toast';
import { Dialog } from '../../shared/components/dialog/dialog';
import { Button } from "../../shared/components/ui/button/button";

@Component({
  selector: 'app-test-page',
  imports: [
    Toast,
    Dialog,
    Button
],
  templateUrl: './test-page.html',
  styleUrl: './test-page.css',
})
export class TestPage {
  toast = viewChild.required(Toast);

  onSuccess() {
    this.toast().show(
      'Đăng nhập thành công',
      'success'
    );
  }

  onError() {
    this.toast().show(
      'Có lỗi xảy ra',
      'error'
    );
  }

  dialogVisible = signal(false);

  onToggleDialog() {
    this.dialogVisible.set(!this.dialogVisible());
  }

}
