import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthorPostService } from '../../../services/author-post.service';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { AuthorJson } from 'src/app/models/authorData';
import { Author } from 'src/app/entities/author/author';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.page.html',
  styleUrls: ['./authors.page.scss'],
})
export class AuthorsPage implements OnInit {
  @Input() selectAuthor!: Author;

  updAuthor!: Author;
  private authorEL: any;
  private isUpdate:boolean = false;

  constructor(private authorPostService: AuthorPostService,
    private modalCtrl: ModalController,
    private sqliteService: SQLiteService,
    private elementRef : ElementRef) {

  }

  ngOnInit() {
    this.authorEL = this.elementRef.nativeElement.querySelector(`#authors-cmp-author`);
  }
  // Private functions
  /**
   * Close
   */
  async close() {
    if(this.isUpdate) {
      await this.authorPostService.getAuthorData();
      this.isUpdate = false;
    }
    // check if selectAuthor still exists
    if(!this.selectAuthor) {
      return this.modalCtrl.dismiss(null, 'close');
    }
    const autExist: Author = await this.authorPostService.getAuthor({id: this.selectAuthor.id});

    if(autExist && autExist.id > 0) {
      return this.modalCtrl.dismiss(autExist, 'close');
    } else {
      return this.modalCtrl.dismiss(null, 'close');
    }
  }
  /**
   * handle the outAuthor Event from cmp-author component
   * @param author
   * @returns
   */
  async handleOutAuthor(author:Author) {
    if(author && author.id > 0) {
      const authJson: AuthorJson = author;
      try {
        const updAuthor = await this.authorPostService.getAuthor(authJson);
        await this.authorPostService.getAllAuthors();
        await this.authorPostService.getAllIdsSeq();
        this.isUpdate = true;
        if (this.sqliteService.getPlatform() === 'web') {
          // save the databases from memory to store
          await this.sqliteService.getSqliteConnection().saveToStore(this.authorPostService.database);
        }
        this.authorEL.classList.add('hidden');
      } catch (err: any) {
        const msg = err.message ? err.message : err;
        console.log(`onSubmit Update Author: ${err}`);
        await Toast.show({
          text: `onSubmit Update Author: ${err} `,
          duration: 'long'
        });
      }
    } else {
      await Toast.show({
        text: `onSubmit Update Author: id <= 0 `,
        duration: 'long'
      });
    }
  }
  /**
   * handle the toUpdateAuthor Event from cmp-authors component
   * @param author
   * @returns
   */
  async handleToUpdateAuthor(data:any) {
    this.isUpdate = true;
    if(this.sqliteService.getPlatform() === 'web') {
      await this.sqliteService.getSqliteConnection().saveToStore(data.database);
    }
    if(data.command === 'update') {
      this.updAuthor = data.author;
      this.authorEL.classList.remove('hidden');
    }
  }

}
