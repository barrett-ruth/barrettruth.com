import type { CollectionEntry } from "astro:content";

export type CollectionKey =
  | "algorithms"
  | "software"
  | "meditations"
  | "autonomous-racing"
  | "git"
  | "death";
export type PostCollection = Exclude<CollectionKey, "git">;

export type AnyCollectionEntry =
  | CollectionEntry<"algorithms">
  | CollectionEntry<"software">
  | CollectionEntry<"meditations">
  | CollectionEntry<"autonomous-racing">
  | CollectionEntry<"death">
  | CollectionEntry<"git">;
