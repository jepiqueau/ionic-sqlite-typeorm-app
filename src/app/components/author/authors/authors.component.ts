import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { Author } from 'src/app/entities/author/author';
import { addIcons } from 'ionicons';
import { create, trash } from 'ionicons/icons';

@Component({
  selector: 'app-cmp-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
})
export class AuthorsComponent implements OnInit {
  @Output() toUpdateAuthor = new EventEmitter<{command: string, database: string, author: Author}>();

  public authorList: Author[] = [];

  constructor(private authorPostService: AuthorPostService) {
    addIcons({create, trash});
  }

  ngOnInit() {
    try {
      this.authorPostService.authorState().subscribe((res) => {
        if(res) {
          this.authorPostService.fetchAuthors().subscribe(data => {
            this.authorList = data;
          });
        }
      });
    } catch(err) {
      throw new Error(`Error: ${err}`);
    }
  }
  // Private functions
  /**
   * update an author
   * @param author
   */
  updateAuthor(author: Author) {
    this.toUpdateAuthor.emit({command: "update", database: this.authorPostService.database, author: author});
  }
  /**
   * delete an author
   * @param author
   */
  async deleteAuthor(author: Author) {
    try {
      await this.authorPostService.deleteAuthor(author.id);
      await this.authorPostService.getAllAuthors();
      this.toUpdateAuthor.emit({command: "delete", database: this.authorPostService.database, author: author});
    } catch(err) {
      throw new Error(`Error: ${err}`);
    }
  }

}
