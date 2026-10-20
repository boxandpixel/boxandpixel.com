import { sanityClient } from "sanity:client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageAsset } from "./types";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageAsset) {
  return builder.image(source);
}

/** Render a Sanity datetime as e.g. "13 July 2026". */
export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
