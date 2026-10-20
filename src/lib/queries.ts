import { defineQuery } from "groq";

/** Published posts, newest first. List view — no body. */
export const POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && defined(publishedAt)]
    | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      coverImage
    }
`);

/** A single post by slug. Detail view — includes body. */
export const POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage,
    body
  }
`);

/** Slugs for every published post — used by getStaticPaths. */
export const POST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && defined(publishedAt)] {
    "params": { "slug": slug.current }
  }
`);
