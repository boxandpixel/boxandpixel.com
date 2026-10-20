import type { TypedObject } from "astro-portabletext/types";

export interface SanityImageAsset {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

/** A blog post as returned by POSTS_QUERY — list view, no body. */
export interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  coverImage?: SanityImageAsset;
}

/** A blog post as returned by POST_QUERY — detail view, includes body.
 *  body holds text blocks and inline image blocks, so it's TypedObject[]. */
export interface Post extends PostSummary {
  body?: TypedObject[];
}
