import { App, PluginSettingTab, Setting } from "obsidian";
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
