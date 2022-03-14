import { Plugin } from "obsidian";
import { headingMarkerPlugin } from "./headingWidget";

export default class LapelPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerEditorExtension(headingMarkerPlugin(this.app));
  }
}
