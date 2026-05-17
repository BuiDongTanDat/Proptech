import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmailEditorModule } from 'angular-email-editor';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    EmailEditorModule // Unlayer hỗ trợ thiết kế tin đăng 
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Protech');
}
