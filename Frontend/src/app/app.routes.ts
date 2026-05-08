import { Routes } from '@angular/router';
import { ClientLayout } from './shared/layout/client-layout/client-layout';
import { NotFound } from './pages/not-found/not-found';
import { PropertyDetail } from './pages/client/property-detail/property-detail';
import { TestPage } from './pages/test-page/test-page';
import { LoginPage } from './pages/auth/login-page/login-page';
import { ForgotPage } from './pages/auth/forgot-page/forgot-page';
import { AdminLayout } from './shared/layout/admin-layout/admin-layout';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { LandingPage } from './pages/client/landing-page/landing-page';
import { AboutUs } from './pages/client/about-us/about-us';
import { PropertiesPage } from './pages/client/properties-client/properties-page/properties-page';
import { PropertiesListPage } from './pages/admin/admin-properties/properties-list-page/properties-list-page';
import { UsersListPage } from './pages/admin/admin-users/users-list-page/users-list-page';
import { ContactListPage } from './pages/admin/admin-contact/contact-list-page/contact-list-page';
import { AdminCompanyInfo } from './pages/admin/admin-company-info/admin-company-info';
import { AdminUserInfo } from './pages/admin/admin-user-info/admin-user-info';
import { AdminSetting } from './pages/admin/admin-setting/admin-setting';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {
        path: '',
        component: ClientLayout,
        children: [
            {
                path: '',
                component: LandingPage,
            },
            {
                path: 'home',
                redirectTo: '',
                pathMatch: 'full',
            },
            {
                path: 'properties',
                component: PropertiesPage,
            },
            {
                path: 'properties/:id',
                component: PropertyDetail, // Sử dụng cùng component để hiển thị chi tiết
            },
            {
                path: 'about',
                component: AboutUs,
            },
            {
                path: 'test',
                component: TestPage,
            }

        ]
    },

    //Auth pages 
    {
        path: 'auth',
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
            {
                path: 'login',
                component: LoginPage,
            },
            {
                path: 'forgot-password',
                component: ForgotPage,
            },
            {
                path: 'reset-password',
                component: ResetPassword,
            }
        ]
    },
    //Admin pages
    // --- ADMIN SIDE (Dùng AdminLayout) ---
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: AdminDashboard

            },
            {
                path: 'properties',
                component: PropertiesListPage
            },
            {
                path: 'contact',
                component: ContactListPage
            },
            {
                path: 'account',
                component: UsersListPage
            },
            {
                path: 'info',
                component: AdminCompanyInfo
            },
            {
                path: 'profile',
                component: AdminUserInfo
            },
            {
                path: 'setting',
                component: AdminSetting
            }
        ]
    },
    // Error pages 
    {
        path: '**',
        component: NotFound,
    }
];
