import { Entry, Asset } from "contentful";
import { Book } from "./book";
import { Person } from "./person";
import { SermonSeries } from "./SermonSeries";
export interface Sermon {
  readonly title: string;
  readonly slug: string;
  readonly date: string;
  readonly speakers: ReadonlyArray<Entry<Person>>;
  readonly series?: Entry<SermonSeries>;
  readonly description?: string;
  readonly books?: ReadonlyArray<Entry<Book>>;
  readonly scriptures?: ReadonlyArray<string>;
  readonly length: string;
  readonly file: Asset;
}
