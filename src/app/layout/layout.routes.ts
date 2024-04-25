import { NgModule } from "@angular/core";
import { RouterModule, RouterOutlet, Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../shared/components/header/header.component";

export const layoutRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [   
            {
                path: '',
                loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
            },      
            {
                path: 'seller',
                loadComponent: () => import('./pages/seller/seller.component').then(c => c.SellerComponent)
            },      
            {
                path: 'department',
                loadComponent: () => import('./pages/department/department.component').then(c => c.DepartmentComponent)
            }
        ]
    }
]

@NgModule({
    declarations: [ LayoutComponent ],
    imports: [
        CommonModule,        
        RouterOutlet,
        RouterModule.forChild(layoutRoutes),
        HeaderComponent
    ]
})
export class LayoutRoutesModule { }