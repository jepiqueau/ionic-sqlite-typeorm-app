import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthorPostService } from '../../../services/author-post.service';
import { IdsSeq, CategoryJson } from '../../../models/authorData';
import { Category } from 'src/app/entities/author/category';

@Component({
  selector: 'app-cmp-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() inCategory!: Category;
  @Output() outCategoryEvent = new EventEmitter<Category>();

  ngOnChanges(changes: SimpleChanges) {
    // get Current Value
    if (this.inCategory) {
      this.isUpdate = true;
      this.currentVal = changes['inCategory'].currentValue;
      if(this.currentVal) {
        this.name!.setValue(this.currentVal.name);
//        this.inputEl.value = this.currentVal.name;
      }
    }
  }

  public categoryForm!: FormGroup;
  public currentVal!: CategoryJson;
  private idsSeqList: IdsSeq[] = [];
  private isUpdate: boolean = false;
//  private inputEl: any;

  constructor(private authorPostService: AuthorPostService,
              private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    try {
      this.isUpdate = false;
      this.authorPostService.idsSeqState().subscribe((res) => {
        if(res) {
          this.authorPostService.fetchIdsSeq().subscribe(data => {
            this.idsSeqList = data;
          });
        }
      });
    } catch(err) {
      throw new Error(`Error: ${err}`);
    }

    this.categoryForm = this.formBuilder.group({
      name: new FormControl('')
    });
//    this.inputEl = this.elementRef.nativeElement.querySelector(`#category-cmp-name`);

  }
  // Private functions
  /**
   * Get the category name from the form
   */
  get name() {
    return this.categoryForm.get("name");
  }
  /**
   * Submit the new category from the form
   */
  async onSubmit() {
    let categoryId: number = -1;
    if(this.isUpdate) {
      categoryId = this.currentVal.id;
    } else {
      const category = this.idsSeqList.filter(x => x.name === "category")[0];
      if(category) {
        categoryId = category.seq + 1;
      }
    }
    const outCategory: Category = new Category();
    outCategory.id = categoryId;
    outCategory.name = this.name!.value;

    this.outCategoryEvent.emit(outCategory);
  }

}
