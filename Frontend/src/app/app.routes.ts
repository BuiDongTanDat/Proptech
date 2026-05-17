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
import { PostBuilder } from './pages/admin/post-builder/post-builder';
import { PostReview } from './pages/admin/post-builder/post-review/post-review';
import { UnlayerDesign } from './pages/admin/unlayer-design/unlayer-design';
import { PropertyPreview } from './pages/admin/admin-properties/property-preview/property-preview';

export const routes: Routes = [
    {
        path: '',
        component: ClientLayout,
        children: [
            {
                path: '',
                component: LandingPage,
                title: 'Protech - Nơi tìm kiếm bất động sản mơ ước của bạn',
            },
            {
                path: 'home',
                redirectTo: '',
                pathMatch: 'full',
                title: 'Trang chủ',
            },
            {
                path: 'properties',
                component: PropertiesPage,
                title: 'Bất động sản',
            },
            {
                path: 'properties/:id',
                component: PropertyDetail, // Sử dụng cùng component để hiển thị chi tiết
                title: 'Chi tiết bất động sản',
            },
            {
                path: 'about',
                component: AboutUs,
                title: 'Về chúng tôi',
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
                title: 'Đăng nhập - Protech',
            },
            {
                path: 'forgot-password',
                component: ForgotPage,
                title: 'Quên mật khẩu - Protech',
            },
            {
                path: 'reset-password',
                component: ResetPassword,
                title: 'Đặt lại mật khẩu - Protech',
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
                pathMatch: 'full',
                title: 'Dashboard',
            },
            {
                path: 'dashboard',
                component: AdminDashboard,
                title: 'Dashboard',

            },
            {
                path: 'properties',
                component: PropertiesListPage,
                title: 'Quản lý bất động sản',
            },
            {
                path: 'contact',
                component: ContactListPage,
                title: 'Quản lý liên hệ',
            },
            {
                path: 'account',
                component: UsersListPage,
                title: 'Quản lý tài khoản',
            },
            {
                path: 'info',
                component: AdminCompanyInfo,
                title: 'Thông tin doanh nghiệp',
            },
            {
                path: 'profile',
                component: AdminUserInfo,
                title: 'Thông tin cá nhân',
            },
            {
                path: 'setting',
                component: AdminSetting,
                title: 'Cài đặt',
            }
        ]
    },

    // Admin Post Add page (Không lồng bên trong AdminLayout)
    {

        path: 'admin/properties/add',
        component: UnlayerDesign,
        title: 'Thêm tin bất động sản',

    },
    {
        path: 'admin/properties/view/:id',
        component: PropertyPreview
    },

    {
        path: 'admin/properties/editor/:id',
        component: UnlayerDesign
    },
    // Error pages 
    {
        path: '**',
        component: NotFound,
    }
];
