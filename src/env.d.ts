/// <reference types="astro/client" />

// Fontsource ships CSS only, with no type declarations for side-effect imports.
declare module "@fontsource-variable/figtree";
declare module "@fontsource-variable/geist-mono";

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  // Server-only — never prefixed with PUBLIC_, so these stay out of the bundle.
  readonly RESEND_API_KEY: string;
  readonly CONTACT_TO_EMAIL: string;
  readonly CONTACT_FROM_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
