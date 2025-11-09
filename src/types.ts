import type { CollectionEntry } from "astro:content";

export type CollectionKey =
  | "algorithms"
  | "software"
  | "meditations"
  | "autonomous-racing"
  | "git"
  | "gists";
export type PostCollection = Exclude<CollectionKey, "git" | "gists">;

export type AnyCollectionEntry =
  | CollectionEntry<"algorithms">
  | CollectionEntry<"software">
  | CollectionEntry<"meditations">
  | CollectionEntry<"autonomous-racing">
  | CollectionEntry<"git">
  | CollectionEntry<"gists">;
