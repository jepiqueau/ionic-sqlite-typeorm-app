import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { Category } from 'src/app/entities/author/category';

@Component({
  selector: 'cmp-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @Output() toUpdateCategory = new EventEmitter<{command: string, database: string, category: Category}>();

  public categoryList: Category[] = [];

  constructor(private authorPostService: AuthorPostService) {
    }

  ngOnInit() {
    try {
      this.authorPostService.categoryState().subscribe((res) => {
        if(res) {
          this.authorPostService.fetchCategories().subscribe(data => {
            this.categoryList = data;
          });
        }
      });
    } catch(err) {
      throw new Error(`Error: ${err}`);
    }
  }
  // Private functions
  /**
   * update a category
   * @param category
   */
  updateCategory(category: Category) {
    this.toUpdateCategory.emit({command: "update", database: this.authorPostService.database, category: category});
  }
  /**
   * delete a category
   * @param category
   */
  async deleteCategory(category: Category) {
    try {
      await this.authorPostService.deleteCategory(category.id);
      await this.authorPostService.getAllCategories();
      this.toUpdateCategory.emit({command: "delete", database: this.authorPostService.database, category: category});
    } catch(err) {
      throw new Error(`Error: ${err}`);
    }
  }
}
