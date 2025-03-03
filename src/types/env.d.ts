/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly WP_DOMAIN: string
  // otras variables de entorno que puedas tener
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
