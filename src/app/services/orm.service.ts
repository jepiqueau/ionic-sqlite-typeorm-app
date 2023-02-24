import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
//import UserDataSource from '../data-sources/UserDataSource';
import AuthorDataSource from '../data-sources/AuthorDataSource';
import { AuthorPostService } from './author-post.service';
import { DataSource, Migration, MigrationInterface } from 'typeorm';

@Injectable()
export class OrmService {
  isOrmService: Boolean = false;

  constructor(private sqliteService: SQLiteService,
    private authorPostService: AuthorPostService) {};

  // Private functions
  /**
   * Initialize the TypeOrm Service
   */
  async initialize(): Promise<void> {
    try {
      // Check connections consistency
      await this.sqliteService.checkConnectionConsistency();

      // Loop through your DataSources
      for (const dataSource of [/*UserDataSource,*/ AuthorDataSource]) {
        const database = String(dataSource.options.database);
        if (!dataSource.isInitialized) {
          // initialize the DataSource
          await dataSource.initialize();
          console.log(`*** dataSource has been initialized ***`)
          // run the migrations
          await dataSource.runMigrations();
          console.log(`*** dataSource runMigration has been run succesfully ***`)
          // load the data for this datasource
          if (database.includes('author')) {
            this.authorPostService.database = database;
            this.authorPostService.dataSource = dataSource;
            await this.authorPostService.initialize();
            console.log(`*** authorPostService has been initialized ***`)
          }
          if (this.sqliteService.getPlatform() === 'web') {
            // save the databases from memory to store
            await this.sqliteService.getSqliteConnection().saveToStore(database);
            console.log(`*** inORMService saveToStore ***`)
          }

        }
        console.log(`DataSource: ${database} initialized`);
      }

      this.isOrmService = true;
    }  catch (err) {
      console.log(`Error: ${err}`);
    }
  }
}

