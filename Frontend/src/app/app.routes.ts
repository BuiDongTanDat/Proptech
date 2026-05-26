import { Routes } from '@angular/router';
import { ClientLayout } from './shared/layout/client-layout/client-layout';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { TokenGuard } from './core/guards/token.guard';
import { UnlayerDesign } from './pages/admin/unlayer-design/unlayer-design';
import { PostReview } from './pages/admin/admin-post/post-preview/post-preview';

export const routes: Routes = [
    {
        path: '',
        component: ClientLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/client/landing-page/landing-page').then(m => m.LandingPage),
                title: 'AH.RPM - Nơi tìm kiếm bất động sản mơ ước của bạn',
            },
            {
                path: 'home',
                redirectTo: '',
                pathMatch: 'full',
                title: 'Trang chủ',
            },
            {
                path: 'properties',
                loadComponent: () => import('./pages/client/properties-client/properties-page/properties-page').then(m => m.PropertiesPage),
                title: 'Bất động sản',
            },
            {
                path: 'properties/:id',
                loadComponent: () => import('./pages/client/property-detail/property-detail').then(m => m.PropertyDetail),
                title: 'Chi tiết bất động sản',
            },
            {
                path: 'about',
                loadComponent: () => import('./pages/client/about-us/about-us').then(m => m.AboutUs),
                title: 'Về chúng tôi',
            },
            {
                path: 'test',
                loadComponent: () => import('./pages/test-page/test-page').then(m => m.TestPage),
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
                loadComponent: () => import('./pages/auth/login-page/login-page').then(m => m.LoginPage),
                title: 'Đăng nhập',
                canActivate: [NoAuthGuard]
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./pages/auth/forgot-page/forgot-page').then(m => m.ForgotPage),
                title: 'Quên mật khẩu',
                canActivate: [NoAuthGuard]
            },
            {
                path: 'reset-password',
                loadComponent: () => import('./pages/auth/reset-password/reset-password').then(m => m.ResetPassword),
                title: 'Đặt lại mật khẩu',
                canActivate: [TokenGuard]
            },
            {
                path: 'setup-password',
                loadComponent: () => import('./pages/auth/setup-password/setup-password').then(m => m.SetupPassword),
                title: 'Thiết lập mật khẩu',
                canActivate: [TokenGuard]
            }
        ]
    },
    //Admin pages
    // --- ADMIN SIDE (Dùng AdminLayout) ---
    {
        path: 'admin',
        loadComponent: () => import('./shared/layout/admin-layout/admin-layout').then(m => m.AdminLayout),
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
                title: 'Dashboard',
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
                title: 'Dashboard',

            },
            {
                path: 'post',
                loadComponent: () => import('./pages/admin/admin-post/post-list-page/post-list-page').then(m => m.PostListPage),
                title: 'Quản lý tin bất động sản',
            },
            {
                path: 'contact',
                loadComponent: () => import('./pages/admin/admin-contact/contact-list-page/contact-list-page').then(m => m.ContactListPage),
                title: 'Quản lý liên hệ',
            },
            {
                path: 'account',
                loadComponent: () => import('./pages/admin/admin-users/users-list-page/users-list-page').then(m => m.UsersListPage),
                title: 'Quản lý tài khoản',
            },
            {
                path: 'info',
                loadComponent: () => import('./pages/admin/admin-company-info/admin-company-info').then(m => m.AdminCompanyInfo),
                title: 'Thông tin doanh nghiệp',
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/admin/admin-user-info/admin-user-info').then(m => m.AdminUserInfo),
                title: 'Thông tin cá nhân',
            },
            {
                path: 'setting',
                loadComponent: () => import('./pages/admin/admin-setting/admin-setting').then(m => m.AdminSetting),
                title: 'Cài đặt',
            }
        ]
    },

    // Admin Post Add page (Không lồng bên trong AdminLayout)
    {

        path: 'admin/post/add',
        component: UnlayerDesign,
        title: 'Thêm tin bất động sản',

    },
    {
        path: 'admin/post/view/:id',
        component: PostReview
    },

    {
        path: 'admin/post/editor/:id',
        component: UnlayerDesign
    },
    // Error pages 
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
    }
];
