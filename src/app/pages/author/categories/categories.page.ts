import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthorPostService } from '../../../services/author-post.service';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { CategoryJson } from 'src/app/models/authorData';
import { Category } from 'src/app/entities/author/category';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  @Input() selectCategory!: Category;

  updCategory!: Category;
  private categoryEL: any;
  private isUpdate:boolean = false;

  constructor(private authorPostService: AuthorPostService,
              private modalCtrl: ModalController,
              private sqliteService: SQLiteService,
              private elementRef : ElementRef) {

  }

  ngOnInit() {
    this.categoryEL = this.elementRef.nativeElement.querySelector(`#categories-cmp-category`);
  }
  // Private functions
  /**
   * Close
   * @returns
   */
  async close() {
    if(this.isUpdate) {
      await this.authorPostService.getAuthorData();
      this.isUpdate = false;
    }
    // check if selectCategory still exists
    if(!this.selectCategory) {
      return this.modalCtrl.dismiss(null, 'close');
    }
    const catExist: Category = await this.authorPostService.getCategory({id: this.selectCategory.id});

    if(catExist && catExist.id > 0) {
      return this.modalCtrl.dismiss(catExist, 'close');
    } else {
      return this.modalCtrl.dismiss(null, 'close');
    }
  }
  /**
   * handle the outCategory Event from cmp-category component
   * @param category
   * @returns
   */
  async handleOutCategory(category:Category) {
    if(category && category.id > 0) {
      try {
        const catJson: CategoryJson = category;
        const updCategory = await this.authorPostService.getCategory(catJson);
        await this.authorPostService.getAllCategories();
        await this.authorPostService.getAllIdsSeq();
        this.isUpdate = true;
        if (this.sqliteService.getPlatform() === 'web') {
          // save the databases from memory to store
          await this.sqliteService.getSqliteConnection().saveToStore(this.authorPostService.database);
        }
        this.categoryEL.classList.add('hidden');
      } catch (err: any) {
        const msg = err.message ? err.message : err;
        console.log(`onSubmit Update Category: ${err}`);
        await Toast.show({
          text: `onSubmit Update Category: ${err} `,
          duration: 'long'
        });
      }
    } else {
      await Toast.show({
        text: `onSubmit Update Category: id <= 0 `,
        duration: 'long'
      });
    }
  }
  /**
   * handle the toUpdateCategory Event from cmp-categories component
   * @param data
   * @returns
   */
  async handleToUpdateCategory(data:any) {
    this.isUpdate = true;
    if(this.sqliteService.getPlatform() === 'web') {
      await this.sqliteService.getSqliteConnection().saveToStore(data.database);
    }
    if(data.command === 'update') {
      this.updCategory = data.category;
      this.categoryEL.classList.remove('hidden');
    }
  }
}
