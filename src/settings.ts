import {
  App,
  PluginSettingTab,
  Setting,
  requireApiVersion,
  type SettingDefinitionItem,
} from "obsidian";
import LapelPlugin from "./index";

export interface LapelSettings {
  showBeforeLineNumbers: boolean;
  showInSourceMode: boolean;
}

export const DEFAULT_SETTINGS: LapelSettings = {
  showBeforeLineNumbers: true,
  showInSourceMode: false,
};

export class LapelSettingsTab extends PluginSettingTab {
  plugin: LapelPlugin;

  constructor(app: App, plugin: LapelPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    if (!requireApiVersion("1.13.0")) {
      return [];
    }

    return [
      {
        name: "Show before line numbers",
        desc: "Toggle whether the heading markers are shown before or after the line numbers in the gutter.",
        control: {
          type: "toggle",
          key: "showBeforeLineNumbers",
          defaultValue: DEFAULT_SETTINGS.showBeforeLineNumbers,
        },
      },
      {
        name: "Show in source mode",
        desc: "Toggle whether the heading markers are shown in in source mode.",
        control: {
          type: "toggle",
          key: "showInSourceMode",
          defaultValue: DEFAULT_SETTINGS.showInSourceMode,
        },
      },
    ];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (key === "showBeforeLineNumbers") {
      await this.plugin.updateSettings(() => ({
        showBeforeLineNumbers: value as boolean,
      }));
      return;
    }

    if (key === "showInSourceMode") {
      await this.plugin.updateSettings(() => ({
        showInSourceMode: value as boolean,
      }));
      return;
    }

    throw new Error(`Unknown Lapel setting key: ${key}`);
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Show before line numbers")
      .setDesc(
        "Toggle whether the heading markers are shown before or after the line numbers in the gutter."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showBeforeLineNumbers)
          .onChange(async (value) => {
            void this.plugin.updateSettings(() => ({
              showBeforeLineNumbers: value,
            }));
          })
      );

    new Setting(containerEl)
      .setName("Show in source mode")
      .setDesc(
        "Toggle whether the heading markers are shown in in source mode."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showInSourceMode)
          .onChange(async (value) => {
            void this.plugin.updateSettings(() => ({
              showInSourceMode: value,
            }));
          })
      );
  }
}
