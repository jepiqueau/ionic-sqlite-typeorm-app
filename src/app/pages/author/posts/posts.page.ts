import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { PostJson } from 'src/app/models/authorData';
import { Post } from 'src/app/entities/author/post';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  updPost!: Post;
  private postEL: any;
  private postsEL: any;
  private isUpdate:boolean = false;

  constructor(private authorPostService: AuthorPostService,
    private sqliteService: SQLiteService,
    private modalCtrl: ModalController,
    private elementRef : ElementRef) {

  }

  ngOnInit() {
    this.postEL = this.elementRef.nativeElement.querySelector(`#posts-cmp-post`);
    this.postsEL = this.elementRef.nativeElement.querySelector(`#posts-cmp-posts`);
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
    return this.modalCtrl.dismiss();
  }
  /**
   * handle the outPost Event from cmp-post component
   * @param post
   * @returns
   */
  async handleOutPost(post:Post) {
    if(post && post.id > 0) {
      const postJson: PostJson = this.authorPostService.getJsonFromPost(post);
      try {
        const updPost = await this.authorPostService.getPost(postJson);
        await this.authorPostService.getAllPosts();
        await this.authorPostService.getAllIdsSeq();
        this.isUpdate = true;
        if (this.sqliteService.getPlatform() === 'web') {
          // save the databases from memory to store
          await this.sqliteService.getSqliteConnection().saveToStore(this.authorPostService.database);
        }
        this.postEL.classList.add('hidden');
        this.postsEL.classList.remove('hidden');
      } catch (err: any) {
        const msg = err.message ? err.message : err;
        console.log(`onSubmit Update Post: ${err}`);
        await Toast.show({
          text: `onSubmit Update Post: ${err} `,
          duration: 'long'
        });
      }
    } else {
      await Toast.show({
        text: `onSubmit Update Post: id <= 0 `,
        duration: 'long'
      });
    }
  }
  /**
   * handle the toUpdatePost Event from cmp-posts component
   * @param data
   * @returns
   */
  async handleToUpdatePost(data:any) {
    this.isUpdate = true;
    if(this.sqliteService.getPlatform() === 'web') {
      await this.sqliteService.getSqliteConnection().saveToStore(data.database);
    }
    if(data.command === 'update') {
      this.updPost = data.post;
      this.postEL.classList.remove('hidden');
      this.postsEL.classList.add('hidden');
    }
    await this.authorPostService.getAllPosts();
  }
}
