import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { CategoryJson } from 'src/app/models/authorData';
import { Category } from 'src/app/entities/author/category';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  public categoryList: Category[] = [];
  private newCategory!: Category;
  private categoryJson!: CategoryJson;

  constructor(private authorPostService: AuthorPostService,
              private sqliteService: SQLiteService,
              private modalCtrl: ModalController) {
  }

  ngOnInit() {
  }
  // Private functions
  /**
   * Cancel
   * @returns
   */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  /**
   * handle the outCategory Event from cmp-category component
   * @param category
   * @returns
   */
  async handleOutCategory(category:CategoryJson) {
    this.categoryJson = category;
    if(this.categoryJson && this.categoryJson.id > 0) {
      try {
        this.newCategory = await this.authorPostService.getCategory(this.categoryJson);
        await this.authorPostService.getAllCategories();
        await this.authorPostService.getAllIdsSeq();
        if (this.sqliteService.getPlatform() === 'web') {
          // save the databases from memory to store
          await this.sqliteService.getSqliteConnection().saveToStore(this.authorPostService.database);
        }
      } catch (err: any) {
        const msg = err.message ? err.message : err;
        console.log(`onSubmit Category: ${err}`);
        await Toast.show({
          text: `onSubmit Category: ${err} `,
          duration: 'long'
        });
      }
      return this.modalCtrl.dismiss(this.newCategory, 'confirm');
    } else {
      await Toast.show({
        text: `onSubmit Category: id <= 0 `,
        duration: 'long'
      });
      return this.modalCtrl.dismiss(null, 'cancel');
    }
  }
}

