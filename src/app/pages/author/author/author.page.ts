import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { AuthorJson } from 'src/app/models/authorData';
import { Author } from 'src/app/entities/author/author';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-author',
  templateUrl: './author.page.html',
  styleUrls: ['./author.page.scss'],
})
export class AuthorPage {
  public authorList: Author[] = [];
  private newAuthor!: Author;
  private authorJson!: AuthorJson;

  constructor(private authorPostService: AuthorPostService,
              private sqliteService: SQLiteService,
              private modalCtrl: ModalController) {
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
   * handle the outAuthor Event from cmp-author component
   * @param author
   * @returns
   */
  async handleOutAuthor(author:AuthorJson) {
    this.authorJson = author;
    if(this.authorJson && this.authorJson.id > 0) {
      try {
        this.newAuthor = await this.authorPostService.getAuthor(this.authorJson);
        await this.authorPostService.getAllAuthors();
        await this.authorPostService.getAllIdsSeq();
        if (this.sqliteService.getPlatform() === 'web') {
          // save the databases from memory to store
          await this.sqliteService.getSqliteConnection().saveToStore(this.authorPostService.database);
        }
      } catch (err: any) {
        const msg = err.message ? err.message : err;
        console.log(`onSubmit Author: ${err}`);
        await Toast.show({
          text: `onSubmit Author: ${err} `,
          duration: 'long'
        });
      }
      return this.modalCtrl.dismiss(this.newAuthor, 'confirm');
    } else {
      await Toast.show({
        text: `onSubmit Author: id <= 0 `,
        duration: 'long'
      });
      return this.modalCtrl.dismiss(null, 'cancel');
    }
  }
}

