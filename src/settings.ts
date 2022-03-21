import { App, PluginSettingTab, Setting } from "obsidian";
import LapelPlugin from "src";

export interface LapelSettings {
  showBeforeLineNumbers: boolean;
}

export const DEFAULT_SETTINGS: LapelSettings = {
  showBeforeLineNumbers: true,
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
    containerEl.createEl("h3", { text: "Appearance" });

    new Setting(containerEl)
      .setName("Show before line numbers")
      .setDesc(
        "Toggle whether the heading markers are shown before or after the line numbers in the gutter."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showBeforeLineNumbers)
          .onChange(async (value) => {
            this.plugin.updateSettings(() => ({
              showBeforeLineNumbers: value,
            }));
          })
      );
  }
}
