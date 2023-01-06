import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { CategoryPageRoutingModule } from './category-routing.module';

import { CategoryPage } from './category.page';
import { CategoryComponentModule } from 'src/app/shared/components/author/category.shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CategoryComponentModule,
    CategoryPageRoutingModule
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
