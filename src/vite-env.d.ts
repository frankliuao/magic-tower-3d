/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_DEBUG?: string;
  readonly VITE_ENABLE_CHEAT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
