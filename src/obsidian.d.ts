import "obsidian";

declare module "obsidian" {
  interface VaultSettings {
    legacyEditor: boolean;
    foldHeading: boolean;
    foldIndent: boolean;
    rightToLeft: boolean;
    readableLineLength: boolean;
    tabSize: number;
    showFrontmatter: boolean;
    showLineNumber: boolean;
  }

  interface Vault {
    config: Record<string, any>;
    getConfig<T extends keyof VaultSettings>(setting: T): VaultSettings[T];
  }

  export interface PluginInstance {
    id: string;
  }

  export interface InstalledPlugin {
    enabled: boolean;
    instance: PluginInstance;
  }

  export interface InternalPlugins {
    plugins: Record<string, InstalledPlugin>;
    getPluginById(id: string): InstalledPlugin;
  }
}
