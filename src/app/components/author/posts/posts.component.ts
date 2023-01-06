import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { Post } from 'src/app/entities/author/post';

@Component({
  selector: 'cmp-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  @Output() toUpdatePost = new EventEmitter<{command: string, database: string, post: Post}>();

  public postList: Post[] = [];

  constructor(private authorPostService: AuthorPostService) {
  }

  ngOnInit() {
    try {
      this.authorPostService.postState().subscribe((res) => {
        if(res) {
          this.authorPostService.fetchPosts().subscribe(data => {
            this.postList = data;
          });
        }
      });
    } catch(err) {
      throw new Error(`Error: ${err}`);
    }
  }
  /**
   * Update a post
   * @param post
   */
  updatePost(post: Post) {
    this.toUpdatePost.emit({command: "update", database: this.authorPostService.database, post: post});
  }
  /**
   * Delete a post
   * @param post
   */
  async deletePost(post: Post) {
    try {
      await this.authorPostService.deletePost(post.id);
      await this.authorPostService.getAllPosts();
      this.toUpdatePost.emit({command: "delete", database: this.authorPostService.database, post: post});
    } catch(err) {
      throw new Error(`Error: ${err}`);
    }
  }
}

