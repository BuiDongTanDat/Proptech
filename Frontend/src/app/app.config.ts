import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideLucideConfig, provideLucideIcons } from '@lucide/angular';
import { LUCIDE_ICON_SET } from './shared/utils/icons';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
     // Provider cung cấp để dùng icon ở dạng khai báo string 'user' 
    provideLucideConfig({ size: 18 }),
    provideLucideIcons(...LUCIDE_ICON_SET),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    
  ]

  
};
