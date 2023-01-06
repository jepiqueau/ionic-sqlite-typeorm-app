import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Toast } from '@capacitor/toast';
import { ModalController } from '@ionic/angular';

import { OrmService } from '../services/orm.service';
import { AuthorPostService } from '../services/author-post.service';
import { Author } from '../entities/author/author';
import { Category } from '../entities/author/category';
import { Post } from '../entities/author/post';
import { PostPage } from 'src/app/pages/author/post/post.page';
import { PostsPage } from 'src/app/pages/author/posts/posts.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  mainForm!: FormGroup;
  categoryGroup!: FormGroup;
  authorGroup!: FormGroup;
  categories!: FormControl;
  authors!: FormControl;

  public authorsData: any[] = [];
  public authorList: Author[] = [];
  public categoryList: Category[] = [];
  public postList: Post[] = [];

  constructor(private ormService: OrmService,
    private modalCtrl: ModalController) {
  }
  ngOnInit(): void {

    this.initOrmService().then (async () => {
      if(!this.ormService.isOrmService) {
        throw new Error(`Error: TypeOrm Service didn't start`);
      }
    });

  }

  // Private methods
  /**
   * Initialize the TypeOrm service
   */
  async initOrmService() {
    try {
      await this.ormService.initialize();
    } catch(err: any) {
      const msg = err.message ? err.message : err
      throw new Error(`Error: ${msg}`);
    }
  }
  /**
   * add a post
   */
  async addPost() {
    const modal = await this.modalCtrl.create({
      component: PostPage,
      canDismiss: true
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      if(data) {
         await Toast.show({
          text: `addPost: ${JSON.stringify(data)}`,
          duration: 'long'
        });
      }
    }
  }
  /**
   * list the post
   */
  async listPost() {
    const modal = await this.modalCtrl.create({
      component: PostsPage,
      canDismiss: true
    });
    modal.present();
  }

}
