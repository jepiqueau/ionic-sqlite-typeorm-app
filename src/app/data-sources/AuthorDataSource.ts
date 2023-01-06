import { Post } from '../entities/author/post';
import { Author } from '../entities/author/author';
import { Category } from '../entities/author/category';
import { InitializeAuthorPost1671880018001 } from '../migrations/author/1671880018001-InitializeAuthorPost';
import { DataSource } from 'typeorm';
import { SQLiteService } from '../services/sqlite.service';

const sqliteService = new SQLiteService();
const sqliteConnection = sqliteService.getSqliteConnection();

export default new DataSource({
  name: 'authorConnection',
  type: 'capacitor',
  driver: sqliteConnection,
  database: 'ionic-sqlite-author',
  mode: 'no-encryption',
  entities: [Author, Category, Post],
  migrations: [InitializeAuthorPost1671880018001],
  subscribers: [],
  logging: [/*'query',*/ 'error','schema'],
  synchronize: false,
  migrationsRun: false,
});
