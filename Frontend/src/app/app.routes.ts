import { Routes } from '@angular/router';
import { ClientLayout } from './shared/layout/client-layout/client-layout';
import { NotFound } from './pages/not-found/not-found';
import { LandingPage } from './pages/landing-page/landing-page';
import { PropertiesPage } from './pages/properties-client/properties-page/properties-page';
import { AboutUs } from './pages/about-us/about-us';
import { PropertyDetail } from './pages/property-detail/property-detail';
import { TestPage } from './pages/test-page/test-page';

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
    
    //Admin pages

    // Error pages 
    {
        path: '**',
        component: NotFound,
    }
];
