import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostsPageRoutingModule } from './posts-routing.module';

import { PostsPage } from './posts.page';
import { PostsComponent } from 'src/app/components/author/posts/posts.component';
import { PostComponentModule } from 'src/app/shared/components/author/post.shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostComponentModule,
    PostsPageRoutingModule
  ],
  declarations: [PostsPage, PostsComponent]
})
export class PostsPageModule {}
