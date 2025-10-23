// deno-lint-ignore-file no-empty-interface
interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly NODE_ENV: string;
  readonly FRONTEND_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
