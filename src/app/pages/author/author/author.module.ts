import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AuthorPageRoutingModule } from './author-routing.module';

import { AuthorPage } from './author.page';
import { AuthorComponentModule } from 'src/app/shared/components/author/author.shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AuthorComponentModule,
    AuthorPageRoutingModule
  ],
  declarations: [AuthorPage]
})
export class AuthorPageModule {}
