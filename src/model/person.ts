import { Asset } from "contentful";
export interface Person {
  readonly name: string;
  readonly slug: string;
  readonly position?: string;
  readonly photo?: Asset;
  readonly biography?: string;
  readonly ordinal?: number;
}
