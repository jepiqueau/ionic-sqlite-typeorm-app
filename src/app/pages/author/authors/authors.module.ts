import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AuthorsPageRoutingModule } from './authors-routing.module';

import { AuthorsPage } from './authors.page';
import { AuthorsComponent } from 'src/app/components/author/authors/authors.component';
import { AuthorComponentModule } from 'src/app/shared/components/author/author.shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AuthorComponentModule,
    AuthorsPageRoutingModule
  ],
  declarations: [AuthorsPage, AuthorsComponent]
})
export class AuthorsPageModule {}
