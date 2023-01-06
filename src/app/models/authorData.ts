export class AuthorJson {
  id!: number;
  name!: string;
  email!: string;
  birthday?: string;
}
export class PostJson {
  id!: number;
  authorId!: number;
  categoryIds!: number[];
  title!: string;
  text!: string;
}
export class CategoryJson {
  id!: number;
  name!: string;
}
export class AuthorData {
  id!: number;
  authorId!: number;
  author!: string;
  email!: string;
  birthday!: string;
  postId!: number;
  title!: string;
  text!: string;
  categoryId!: number;
  category!: string;
}
export class AuthorPostData {
  id!: number;
  authorId!: number;
  author!: string;
  email!: string;
  birthday!: string;
  postId!: number;
  title!: string;
  text!: string;
  categoryIds!: number[];
  categories!: string[];
}
export class IdsSeq {
  name!: string;
  seq!: number;
}
