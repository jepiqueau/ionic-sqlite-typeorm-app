import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SQLiteService } from './services/sqlite.service';
import { OrmService } from './services/orm.service';
import { AuthorPostService } from './services/author-post.service';
import { CategoryComponentModule } from './shared/components/author/category.shared.module';

export function initializeFactory(init: SQLiteService) {
  return () => init.initializeWebStore();
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), CategoryComponentModule , AppRoutingModule],
  providers: [SQLiteService, OrmService, AuthorPostService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
      {
        provide: APP_INITIALIZER,
        useFactory: initializeFactory,
        deps: [SQLiteService],
        multi: true
      },
   ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
