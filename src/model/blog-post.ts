import { Entry, Asset } from "contentful";
import { Person } from "./person";
import { Category } from "./category";
import { Book } from "./book";
export interface BlogPost {
  readonly title: string;
  readonly slug: string;
  readonly date: string;
  readonly image?: Asset;
  readonly excerpt?: string;
  readonly body: string;
  readonly authors?: ReadonlyArray<Entry<Person>>;
  readonly categories: ReadonlyArray<Entry<Category>>;
  readonly books?: ReadonlyArray<Entry<Book>>;
  readonly scriptures?: ReadonlyArray<string>;
  readonly files?: ReadonlyArray<Asset>;
}
