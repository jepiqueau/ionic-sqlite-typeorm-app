import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Toast } from '@capacitor/toast';
import { ModalController } from '@ionic/angular';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { IdsSeq } from 'src/app/models/authorData';
import { Author } from 'src/app/entities/author/author';
import { Category } from 'src/app/entities/author/category';
import { Post } from 'src/app/entities/author/post';
import { CategoryPage } from 'src/app/pages/author/category/category.page';
import { CategoriesPage } from 'src/app/pages/author/categories/categories.page';
import { AuthorPage } from 'src/app/pages/author/author/author.page';
import { AuthorsPage } from 'src/app/pages/author/authors/authors.page';
import { addIcons } from 'ionicons';
import { create, list } from 'ionicons/icons';

@Component({
  selector: 'app-cmp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() inPost!: Post;
  @Output() outPostEvent = new EventEmitter<Post>();

  ngOnChanges(changes: SimpleChanges) {
    // get Current Value
    if (this.inPost) {
      this.isUpdate = true;
      this.currentVal = changes['inPost'].currentValue;
      if(this.currentVal) {
        const defCats: Category[]= [];
        for(const cat of this.currentVal.categories) {
          const index = this.getCategoryIndexFromList(cat);
          defCats.push(this.categoryList[index]);
        }
        const idxAuth = this.getAuthorIndexFromList(this.currentVal.author)
        const selAuthor = this.authorList[idxAuth];
        this.defAuthor = [selAuthor];
        this.defCategories = defCats;
        this.setForm();
        this.title!.setValue(this.currentVal.title);
        this.text!.setValue(this.currentVal.text);
      }
    }
  }
  postForm!: FormGroup;
  categoryGroup!: FormGroup;
  authorGroup!: FormGroup;
  postGroup!: FormGroup;
  fcCategories!: FormControl;
  fcAuthor!: FormControl;

  public authorList: Author[] = [];
  public categoryList: Category[] = [];
  public currentCategory!: string;
  public newCategory: Category[] = [];
  public newAuthor: Author[] = [];
  public newPost: Post[] = [];
  public currentVal!: Post;
  private idsSeqList: IdsSeq[] = [];
  private isUpdate: boolean = false;
  public selCategories: Category[] = [];
  public defCategories: Category[] = [];
  public defAuthor: Author[] = [];
  public isForm: boolean = false;

  constructor(private authorPostService: AuthorPostService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController) {
      addIcons({create, list});

  }

  ngOnInit() {
    try {
      this.isUpdate = false;
      this.authorPostService.categoryState().subscribe((res) => {
        if(res) {
          this.authorPostService.fetchCategories().subscribe(data => {
            this.categoryList = data;
          });
        }
      });
      this.authorPostService.authorState().subscribe((res) => {
        if(res) {
          this.authorPostService.fetchAuthors().subscribe(data => {
            this.authorList = data;
          });
        }
      });
      this.authorPostService.idsSeqState().subscribe((res) => {
        if(res) {
          this.authorPostService.fetchIdsSeq().subscribe(data => {
            this.idsSeqList = data;
          });
        }
      });
      if (!this.inPost) {
        this.setForm();
      }

    } catch(err) {
      throw new Error(`Error: ${err}`);
    }
  }
  // Private functions
  /**
   * Create the Reactive Form
   */
  setForm() {
    this.fcCategories = new FormControl('');
    this.categoryGroup = new FormGroup({
      categories: this.fcCategories,
    });
    this.fcAuthor = new FormControl('');

    this.authorGroup = new FormGroup({
      author: this.fcAuthor,
    });

    this.postGroup = new FormGroup({
      title: new FormControl(''),
      text: new FormControl('')
    })
    this.postForm = this.formBuilder.group({
      fg_categories: this.categoryGroup,
      fg_author: this.authorGroup,
      fg_post: this.postGroup,
    });
    this.categories!.setValue(this.defCategories);
    if(this.defAuthor.length === 1) {
      this.author!.setValue(this.defAuthor[0]);
    }
    this.isForm = true;
  }
  /**
   * Get the categories from the form
   */
  get categories() {
    return this.postForm.get("fg_categories")!.get("categories");
  }
  /**
   * Get the author from the form
   */
  get author() {
    return this.postForm.get("fg_author")!.get("author");
  }
  /**
   * Get the post title from the form
   */
  get title() {
    return this.postForm.get("fg_post")!.get("title");
  }
  /**
   * Get the post text from the form
   */
  get text() {
    return this.postForm.get("fg_post")!.get("text");
  }
  /**
   * Add a category
   */
  async addCategory() {
    const modal = await this.modalCtrl.create({
      component: CategoryPage,
      canDismiss: true
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.defCategories = [];
      // Save the existing category selection if any
      if(this.categories!.value) {
        for(const cat of this.categories!.value) {
          const index = this.getCategoryIndexFromList(cat);
          this.defCategories.push(this.categoryList[index]);
        }
      }
      if(data) {
        const index = this.getCategoryIndexFromList(data);
        this.defCategories.push(this.categoryList[index]);
        this.categories!.setValue(this.defCategories);
        await Toast.show({
          text: `addCategory: ${JSON.stringify(this.categoryList[index])}`,
          duration: 'long'
        });
      }
    }
  }
  /**
   * Get the category index from the categoryList
   */
  getCategoryIndexFromList(cat: Category): number {
    const mId = cat.id;
    return this.categoryList.indexOf(this.categoryList.filter((x) => x.id === mId )[0]);
  }
  /**
   * get the list of categories displayed
   */
  async listCategory() {
    const modal = await this.modalCtrl.create({
      component: CategoriesPage,
      componentProps: {
        selectCategory: this.newCategory[0],
      },
      canDismiss: true
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'close') {
      this.categories!.reset();
      this.newCategory = [];
      if(data) {
        const mId = data.id;
        const index = this.categoryList.indexOf(this.categoryList.filter((x) => x.id === mId )[0]);
        this.newCategory.push(this.categoryList[index]);
      }
    }
  }
  /**
   * Add an author
   */
  async addAuthor() {
    const modal = await this.modalCtrl.create({
      component: AuthorPage,
      canDismiss: true
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.author!.reset();
      if(data) {
        const index = this.getAuthorIndexFromList(data);
        const newAuthor: Author = this.authorList[index];
        this.author!.setValue(newAuthor);
        await Toast.show({
          text: `addAuthor: ${JSON.stringify(newAuthor)}`,
          duration: 'long'
        });
      }
    }
  }
  /**
   * Get the author index from the authorList
   */
  getAuthorIndexFromList(auth: any): number {
    const mId = auth.id;
    return this.authorList.indexOf(this.authorList.filter((x) => x.id === mId )[0]);
  }
  /**
   * get the list of authors displayed
   */
  async listAuthor() {
    const modal = await this.modalCtrl.create({
      component: AuthorsPage,
      componentProps: {
        selectAuthor: this.newAuthor[0],
      },
      canDismiss: true
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'close') {
      this.author!.reset();
      if(data) {
        const mId = data.id;
        const index = this.authorList.indexOf(this.authorList.filter((x) => x.id === mId )[0]);
        const newAuthor: Author = this.authorList[index];
        this.author!.setValue(newAuthor);
      }
    }
  }
  /**
   * Submit the new post from the form
   */
  async onSubmit() {
    let postId: number = -1;
    if(this.isUpdate) {
      postId = this.currentVal.id;
    } else {
      const post = this.idsSeqList.filter(x => x.name === "post")[0];
      if(post) {
        postId = post.seq + 1;
      }
    }
    const outPost: Post = new Post();
    outPost.id = postId;
    outPost.title = this.title!.value;
    outPost.text = this.text!.value;
    outPost.author = this.author!.value;
    outPost.categories = this.categories!.value;
    this.outPostEvent.emit(outPost);
  }
  /**
   * compare categories
   */
  compareWithCategory(o1: Category, o2: Category | Category[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }
  /**
   * handle the change category event
   */
  handleChangeCategory() {
    const categories: Category[] = this.categories!.value;
    if(!categories) return;
    const strCategories: string[] = [];
    for( const category of categories) {
      strCategories.push(category.name);
    }
    this.currentCategory = strCategories.toString();
    return;
  }
}
