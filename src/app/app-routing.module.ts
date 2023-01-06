import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'category',
    loadChildren: () => import('./pages/author/category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'author',
    loadChildren: () => import('./pages/author/author/author.module').then( m => m.AuthorPageModule)
  },
  {
    path: 'post',
    loadChildren: () => import('./pages/author/post/post.module').then( m => m.PostPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/author/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'authors',
    loadChildren: () => import('./pages/author/authors/authors.module').then( m => m.AuthorsPageModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./pages/author/posts/posts.module').then( m => m.PostsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
