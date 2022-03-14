import { Plugin } from "obsidian";
import { headingMarkerPlugin } from "./headingWidget";

export default class CreasesPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerEditorExtension(headingMarkerPlugin(this.app));
  }
}
