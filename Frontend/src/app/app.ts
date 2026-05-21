import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmailEditorModule } from 'angular-email-editor';
import { Toast } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    EmailEditorModule,// Unlayer hỗ trợ thiết kế tin đăng 
    Toast
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Protech');
}
