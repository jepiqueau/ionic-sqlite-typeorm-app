import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthorPostService } from 'src/app/services/author-post.service';
import { IdsSeq, AuthorJson } from 'src/app/models/authorData';
import { Author } from 'src/app/entities/author/author';

@Component({
  selector: 'app-cmp-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
})
export class AuthorComponent implements OnInit, OnChanges {
  @Input() inAuthor!: Author;
  @Output() outAuthorEvent = new EventEmitter<Author>();

  ngOnChanges(changes: SimpleChanges) {
    // get Current Value
    if (this.inAuthor) {
      this.isUpdate = true;
      this.currentVal = changes['inAuthor'].currentValue;
      if(this.currentVal) {
        this.name!.setValue(this.currentVal.name);
        this.email!.setValue(this.currentVal.email);
        if(this.currentVal.birthday != null) {
          this.birthday!.setValue(this.currentVal.birthday);
        }
      }
    }
  }

  public authorForm!: FormGroup;
  public currentVal!: AuthorJson;
  private idsSeqList: IdsSeq[] = [];
  private isUpdate: boolean = false;

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

    this.authorForm = this.formBuilder.group({
      name: new FormControl(''),
      email: new FormControl(''),
      birthday: new FormControl('')
    });

  }
  // Private functions
  /**
   * Get the author name from the form
   */
  get name() {
    return this.authorForm.get("name");
  }
  /**
   * Get the author email from the form
   */
  get email() {
    return this.authorForm.get("email");
  }
  /**
   * Get the author birthday from the form
   */
  get birthday() {
    return this.authorForm.get("birthday");
  }

  /**
   * submit an author
   */
  async onSubmit() {
    let authorId: number = -1;
    if(this.isUpdate) {
      authorId = this.currentVal.id;
    } else {
      const author = this.idsSeqList.filter(x => x.name === "category")[0];
      if(author) {
        authorId = author.seq + 1;
      }
    }
    const outAuthor: Author = new Author();
    outAuthor.id = authorId;
    outAuthor.name = this.name!.value;
    outAuthor.email = this.email!.value;
    if(this.birthday!.value) {
      outAuthor.birthday = this.birthday!.value;
    }
    this.outAuthorEvent.emit(outAuthor);
  }

}
