import { Component, OnInit } from '@angular/core';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { AuthorPostData } from 'src/app/models/authorData';

@Component({
  selector: 'cmp-authordata',
  templateUrl: './authordata.component.html',
  styleUrls: ['./authordata.component.scss'],
})
export class AuthordataComponent implements OnInit {

  public authorsData: AuthorPostData[] = [];

  constructor(private authorPostService: AuthorPostService) {
  }

  ngOnInit() {
    try {
      this.authorPostService.authorDataState().subscribe((res) => {
        if(res) {
          this.authorPostService.fetchAuthorData().subscribe(data => {
            this.authorsData = data;
          });
        }
      });
    } catch(err) {
      throw new Error(`Error: ${err}`);
    }
  }

}
