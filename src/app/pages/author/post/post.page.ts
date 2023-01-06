import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { PostJson } from 'src/app/models/authorData';
import { Post } from 'src/app/entities/author/post';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  constructor(private authorPostService: AuthorPostService,
    private sqliteService: SQLiteService,
    private modalCtrl: ModalController) { }

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
   * handle the outPost Event from cmp-post component
   * @param post
   * @returns
   */
  async handleOutPost(post:Post) {
    console.log(`in post.page post: ${JSON.stringify(post)}`)
    if(post && post.id > 0) {
      const postJson: PostJson = this.authorPostService.getJsonFromPost(post);
      try {
        await this.authorPostService.getPost(postJson);
        await this.authorPostService.getAllPosts();
        await this.authorPostService.getAuthorData();
        await this.authorPostService.getAllIdsSeq();
        if (this.sqliteService.getPlatform() === 'web') {
          // save the databases from memory to store
          await this.sqliteService.getSqliteConnection().saveToStore(this.authorPostService.database);
        }
      } catch (err: any) {
        const msg = err.message ? err.message : err;
        console.log(`onSubmit Post: ${err}`);
        await Toast.show({
          text: `onSubmit Post: ${err} `,
          duration: 'long'
        });
      }
      return this.modalCtrl.dismiss(post, 'confirm');
    } else {
      await Toast.show({
        text: `onSubmit Post: id <= 0 `,
        duration: 'long'
      });
      return this.modalCtrl.dismiss(null, 'cancel');
    }
  }

}
