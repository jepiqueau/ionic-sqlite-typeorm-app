import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Post } from '../entities/author/post';
import { Author } from '../entities/author/author';
import { Category } from '../entities/author/category';
import { MOCK_POSTS, MOCK_CATEGORIES, MOCK_AUTHORS} from '../mock-data/posts-categories-authors';
import { AuthorPostData, AuthorData, IdsSeq, PostJson } from '../models/authorData';

@Injectable()
export class AuthorPostService {
  public dataSource!: DataSource;
  public database!: string;
  public authorDataList: BehaviorSubject<AuthorPostData[]> = new BehaviorSubject<AuthorPostData[]>([]);
  public categoryList: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  public authorList: BehaviorSubject<Author[]> = new BehaviorSubject<Author[]>([]);
  public postList: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  public idsSeqList: BehaviorSubject<IdsSeq[]> = new BehaviorSubject<IdsSeq[]>([]);

  private isAuthorDataReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isCategoryReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isPostReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isAuthorReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isIdsSeqReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private postRepository!: Repository<Post>
  private authorRepository!: Repository<Author>
  private categoryRepository!: Repository<Category>

  constructor() {}
  /**
   * Initialize the author-post service
   * @returns
   */
  async initialize(): Promise<void> {
    console.log(`@@@ this.dataSource.isInitialized: ${this.dataSource.isInitialized} @@@@`)
    if (this.dataSource.isInitialized) {
      this.postRepository = this.dataSource.getRepository(Post);
      this.authorRepository = this.dataSource.getRepository(Author);
      this.categoryRepository = this.dataSource.getRepository(Category);
      const authorCount = await this.getAuthorCount();
      console.log(`@@@ authorCount: ${authorCount} @@@@`)
      if(authorCount === 0) {
        // create authors
        for (const author of MOCK_AUTHORS) {
          try {
            await this.getAuthor(author);
          } catch (err: any) {
            const msg = err.message ? err.message : err;
            return Promise.reject(`Error AuthorPostService initialize: ${msg}`);
          }
        }
        console.log(`@@@ after create authors @@@@`)
        // create categories
        for (const category of MOCK_CATEGORIES) {
          try {
            await this.getCategory(category);
          } catch (err: any) {
            const msg = err.message ? err.message : err;
            return Promise.reject(`Error AuthorPostService initialize: ${msg}`);
          }
        }
        console.log(`@@@ after create categories @@@@`)
        // create posts
        for (const post of MOCK_POSTS) {
          try {
            await this.getPost(post);
          } catch (err: any) {
            const msg = err.message ? err.message : err;
            return Promise.reject(`Error AuthorPostService initialize: ${msg}`);
          }
        }
      }
      console.log(`@@@ after create posts @@@@`)
      try {
        this.getAllCategories().then(() => {
          this.isCategoryReady.next(true);
        });
        this.getAllAuthors().then(() => {
          this.isAuthorReady.next(true);
        });
        this.getAllPosts().then(() => {
          this.isPostReady.next(true);
        });
        this.getAuthorData().then(() => {
          this.isAuthorDataReady.next(true);
        });
        this.getAllIdsSeq().then(() => {
          this.isIdsSeqReady.next(true);
        });
      } catch (err: any) {
        const msg = err.message ? err.message : err;
        return Promise.reject(`Error AuthorPostService initialize: ${msg}`);
      }

    } else {
      return Promise.reject(`Error: AuthorDataSource not initialized`)
    }
  }
  /**
   * Return AuthorData state
   * @returns
   */
  authorDataState() {
    return this.isAuthorDataReady.asObservable();
  }
  /**
   * Return Category state
   * @returns
   */
  categoryState() {
    return this.isCategoryReady.asObservable();
  }
  /**
   * Return Author state
   * @returns
   */
  authorState() {
    return this.isAuthorReady.asObservable();
  }
  /**
   * Return Post state
   * @returns
   */
  postState() {
    return this.isPostReady.asObservable();
  }
  /**
   * Return Ids Sequence state
   * @returns
   */
  idsSeqState() {
    return this.isIdsSeqReady.asObservable();
  }
  /**
   * Fetch AuthorData
   * @returns
   */
  fetchAuthorData(): Observable<AuthorPostData[]> {
    return this.authorDataList.asObservable();
  }
  /**
   * Fetch Categories
   * @returns
   */
  fetchCategories(): Observable<Category[]> {
    return this.categoryList.asObservable();
  }
  /**
   * Fetch Authors
   * @returns
   */
  fetchAuthors(): Observable<Author[]> {
    return this.authorList.asObservable();
  }
  /**
   * Fetch Posts
   * @returns
   */
  fetchPosts(): Observable<Post[]> {
    return this.postList.asObservable();
  }
  /**
   * Fetch Ids Sequence
   * @returns
   */
  fetchIdsSeq(): Observable<IdsSeq[]> {
    return this.idsSeqList.asObservable();
  }
  /**
   * Get all Ids Sequence
   * @returns
   */
  async getAllIdsSeq(): Promise<void> {
    try {
      const idsSeq: [IdsSeq] = await this.authorRepository.query("select * from sqlite_sequence");
      this.idsSeqList.next(idsSeq);
    } catch (err:any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error getAllIdsSeq: ${msg}`);
    }
  }
  /**
   * Get Author count
   * @returns
   */
  async getAuthorCount(): Promise<number> {
    try {
      const retCount: any = (await this.authorRepository.query("select count(*) AS count from author"))[0];
      const count: number = retCount.count;
      return count;
    } catch(err: any) {
      return 0;
    }
  }
  /**
   * Get, Create, Update an Author
   * @returns
   */
  async getAuthor(jsonAuthor: any): Promise<Author> {
    try {
      let author = await this.authorRepository.findOneBy({id: jsonAuthor.id});
      if(!author) {
        if(jsonAuthor.email && jsonAuthor.name) {
            // create a new author
          author = new Author();
          author.id = jsonAuthor.id;
          author.name = jsonAuthor.name;
          author.email = jsonAuthor.email;
          if(jsonAuthor.birthday) {
            author.birthday = jsonAuthor.birthday;
          }
          await this.authorRepository.save(author);
          author = await this.authorRepository.findOneBy({id: jsonAuthor.id});
          if(author) {
            return author;
          } else {
            return Promise.reject(`Error: failed to getAuthor for id ${jsonAuthor.id}`);
          }
        } else {
          // author not in the database
          author = new Author();
          author.id = -1;
          return author;
        }
      } else {
        if(Object.keys(jsonAuthor).length > 1) {
          // update and existing author
          const updAuthor = new Author();
          updAuthor.id = jsonAuthor.id;
          updAuthor.name = jsonAuthor.name;
          updAuthor.email = jsonAuthor.email;
          if(jsonAuthor.birthday) {
            updAuthor.birthday = jsonAuthor.birthday;
          }
          await this.authorRepository.save(updAuthor);
          author = await this.authorRepository.findOneBy({id: jsonAuthor.id});
          if(author) {
            return author;
          } else {
            return Promise.reject(`Error: failed to getAuthor for id ${jsonAuthor.id}`);
          }
        } else {
          return author;
        }
      }
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error in getAuthor: ${err}`);
    }
  }
  /**
   * Delete an Author
   * @returns
   */
  async deleteAuthor(id: number): Promise<void>  {
    try {
      let author = await this.authorRepository.findOneBy({id: id});
      if( author) {
        await this.authorRepository.remove(author);
      }
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error in deleteAuthor: ${err}`);
    }
  }
  /**
   * Get all Authors
   * @returns
   */
  async getAllAuthors(): Promise<void> {
    try {
      const authors: [Author] = await this.authorRepository.query("select * from author");
      this.authorList.next(authors);
    } catch (err:any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error getAllAuthors: ${msg}`);
    }
  }
  /**
   * Get, Create, Update a Category
   * @returns
   */
  async getCategory(jsonCategory: any): Promise<Category> {
    try {
      let category = await this.categoryRepository.findOneBy({id: jsonCategory.id});
      if(!category) {
        if(jsonCategory.name) {
          // create a new category
          category = new Category();
          category.id = jsonCategory.id;
          category.name = jsonCategory.name;
          await this.categoryRepository.save(category);
          category = await this.categoryRepository.findOneBy({id: jsonCategory.id});
          if(category) {
            return category;
          } else {
            return Promise.reject(`Error: failed to getCategory for id ${jsonCategory.id}`);
          }
        } else {
          // category not in the database
          category = new Category();
          category.id = -1;
          return category;
        }
      } else {
        if(Object.keys(jsonCategory).length > 1) {
          // update and existing category
          const updCategory = new Category();
          updCategory.id = jsonCategory.id;
          updCategory.name = jsonCategory.name;
          await this.categoryRepository.save(updCategory);
          category = await this.categoryRepository.findOneBy({id: jsonCategory.id});
          if(category) {
            return category;
          } else {
            return Promise.reject(`Error: failed to getCategory for id ${jsonCategory.id}`);
          }
        } else {
          // return an existing category
          return category;
        }
      }
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error in getCategory: ${err}`);
    }
  }
  /**
   * Delete a Category
   * @returns
   */
  async deleteCategory(id: number): Promise<void>  {
    try {
      let category = await this.categoryRepository.findOneBy({id: id});
      if( category) {
        await this.categoryRepository.remove(category);
      }
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error in deleteCategory: ${err}`);
    }
  }
  /**
   * Get all Categories
   * @returns
   */
  async getAllCategories(): Promise<void> {
    try {
      const categories: [Category] = await this.categoryRepository.query("select * from category");
      this.categoryList.next(categories);
    } catch (err:any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error getAllCategories: ${msg}`);
    }
  }
  /**
   * Get, Create, Update a Post
   * @returns
   */
  async getPost(jsonPost: PostJson): Promise<Post> {
    try {
      let post = await this.postRepository.findOneBy({id: jsonPost.id});
      if(!post) {
        if(jsonPost.title) {
          // create a new Post
          post = await this.createPost(jsonPost)
          await this.postRepository.save(post);
          post = await this.postRepository.findOneBy({id: jsonPost.id});
          if(post) {
            return post;
          } else {
            return Promise.reject(`Error: failed to getPost for id ${jsonPost.id}`);
          }
        } else {
          // post not in the database
          post = new Post();
          post.id = -1;
          return post;
        }
      } else {
        if(Object.keys(jsonPost).length > 1) {
          // update and existing post
          const updPost = await this.createPost(jsonPost);
          await this.postRepository.save(updPost);
          post = await this.postRepository.findOneBy({id: jsonPost.id});
          if(post) {
            return post;
          } else {
            return Promise.reject(`Error: failed to getPost for id ${jsonPost.id}`);
          }
        } else {
          return post;
        }
      }
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error in getPost: ${err}`);
    }
  }
  /**
   * Delete a Post
   * @returns
   */
  async deletePost(id: number): Promise<void>  {
    try {
      let post = await this.postRepository.findOneBy({id: id});
      if( post) {
        await this.postRepository.remove(post);
      }
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error in deletePost: ${err}`);
    }
  }
  /**
   * Get all Posts
   * @returns
   */
  async getAllPosts(): Promise<void> {
    try {
      const posts: Post[] = await this.postRepository
      .createQueryBuilder("post")
      .innerJoinAndSelect('post.author', 'author')
      .innerJoinAndSelect('post.categories','category')
      .getMany();
      this.postList.next(posts);
    } catch (err:any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error getAllPosts: ${msg}`);
    }
  }
  /**
   * Create Post
   * @returns
   */
  private async createPost(jsonPost:any): Promise<Post> {
    try {
      const post = new Post();
      post.id = jsonPost.id;
      post.title = jsonPost.title;
      post.text = jsonPost.text;
      if(jsonPost.authorId) {
        const author: Author = await this.getAuthor({id: jsonPost.authorId});
        post.author = author;
      }
      if(jsonPost.categoryIds) {
        const categories: Category[] = new Array();
        for(const cId of jsonPost.categoryIds) {
          let category = await this.categoryRepository.findOneBy({id: cId});
          if(category != null) {
            categories.push(category);
          }
        }
        if(categories.length > 0) {
          post.categories = categories!;
        }
      }
      return post;
    } catch (err:any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error createPost: ${msg}`);
    }
  }
  /**
   * Get all AuthorData
   */
  async getAuthorData() {
    const query = `SELECT author.id AS authorId, author.name AS author, author.email AS email, author.birthday AS birthday,
    post.id AS postId, post.title AS title, post.text AS text, category.id AS categoryId, category.name AS category
    FROM author INNER JOIN post ON post.authorId = author.id
    INNER JOIN post_categories_category ON post_categories_category.postId = post.id
    INNER JOIN category ON category.id = post_categories_category.categoryId
    ORDER BY author,title,category ASC
    `;
    const mAuthorsData: AuthorData[] = await this.authorRepository.query(query);
    const authorsData: AuthorPostData[] = [];
    let prevEmail = mAuthorsData[0].email;
    let prevTitle = mAuthorsData[0].title;
    let mId = 1;
    let mAuthorData: AuthorPostData = {} as AuthorPostData;
    for (const authorData of mAuthorsData) {
      if (authorData.email === prevEmail && authorData.title === prevTitle) {
        if (!mAuthorData.email) {
          mAuthorData.id = mId;
          mAuthorData.authorId= authorData.authorId;
          mAuthorData.author= authorData.author;
          mAuthorData.email = authorData.email;
          mAuthorData.birthday = authorData.birthday;
          mAuthorData.postId= authorData.postId;
          mAuthorData.title = authorData.title;
          mAuthorData.text = authorData.text;
          mAuthorData.categories = [];
          mAuthorData.categoryIds = [];
          mAuthorData.categoryIds.push(authorData.categoryId)
          mAuthorData.categories.push(authorData.category);
        } else {
          mAuthorData.categoryIds.push(authorData.categoryId)
          mAuthorData.categories.push(authorData.category);
        }
      } else {
        authorsData.push(mAuthorData);
        prevEmail = authorData.email;
        prevTitle = authorData.title;
        mId += 1;
        mAuthorData = {} as AuthorPostData;
        mAuthorData.id = mId;
        mAuthorData.authorId= authorData.authorId;
        mAuthorData.author = authorData.author;
        mAuthorData.email = authorData.email;
        mAuthorData.birthday = authorData.birthday;
        mAuthorData.postId= authorData.postId;
        mAuthorData.title = authorData.title;
        mAuthorData.text = authorData.text;
        mAuthorData.categories = [];
        mAuthorData.categoryIds = [];
        mAuthorData.categoryIds.push(authorData.categoryId)
        mAuthorData.categories.push(authorData.category);
      }

    }
    authorsData.push(mAuthorData);

    this.authorDataList.next(authorsData);
  }
  /**
   * Get Json Post from Post
   * @param post
   * @returns
   */
  getJsonFromPost(post: Post): PostJson {
    const postJson: PostJson = {} as PostJson;
    postJson.id = post.id;
    postJson.title = post.title;
    postJson.text = post.text;
    const author: Author = post.author;
    postJson.authorId = author.id;
    const categoriesId: number[] = [];
    for( const category of post.categories) {
      categoriesId.push(category.id);
    }
    postJson.categoryIds = categoriesId;
    return postJson;
  }

}
