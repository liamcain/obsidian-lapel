import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { gutter, GutterMarker } from "@codemirror/gutter";
import { App, editorLivePreviewField, Menu } from "obsidian";
import { syntaxTree } from "@codemirror/language";
import { RangeSet, RangeSetBuilder } from "@codemirror/rangeset";
import { Prec } from "@codemirror/state";

const headingLevels = [1, 2, 3, 4, 5, 6];
const MARKER_CSS_CLASS = "cm-heading-marker";

class HeadingMarker extends GutterMarker {
  constructor(
    readonly app: App,
    readonly view: EditorView,
    readonly headingLevel: number,
    readonly from: number,
    readonly to: number
  ) {
    super();
  }

  toDOM() {
    const markerEl = createDiv({ cls: MARKER_CSS_CLASS });
    markerEl.dataset.level = String(this.headingLevel);
    return markerEl;
  }
}

export function headingMarkerPlugin(app: App) {
  const markers = ViewPlugin.fromClass(
    class {
      markers: RangeSet<HeadingMarker>;

      constructor(public view: EditorView) {
        this.markers = this.buildMarkers(app, view);
      }

      buildMarkers(app: App, view: EditorView) {
        const builder = new RangeSetBuilder<HeadingMarker>();
        syntaxTree(view.state).iterate({
          enter: (type, from, to) => {
            const headingExp = /HyperMD-header_HyperMD-header-(\d)$/.exec(type.name);
            if (headingExp) {
              const headingLevel = Number(headingExp[1]);
              const d = new HeadingMarker(app, view, headingLevel, from, to);
              builder.add(from, to, d);
            }
          },
        });

        return builder.finish();
      }

      update(update: ViewUpdate) {
        if (!update.state.field(editorLivePreviewField)) {
          this.markers = RangeSet.empty;
          return;
        }
        this.markers = this.buildMarkers(app, this.view);
      }
    }
  );

  return [
    markers,
    Prec.high(
      gutter({
        markers(view) {
          return view.plugin(markers)?.markers || RangeSet.empty;
        },
        domEventHandlers: {
          click: (view, line, event: Event) => {
            if (
              event.target instanceof HTMLDivElement &&
              event.target.classList.contains(MARKER_CSS_CLASS)
            ) {
              const menu = new Menu(this.app);
              headingLevels.forEach((level) => {
                menu.addItem((item) =>
                  item
                    .setIcon("hash")
                    .setTitle(`Heading ${level}`)
                    .onClick(() => {
                      const lineWithFormatting = view.state.doc.lineAt(line.from).text;
                      const lineContents = lineWithFormatting.replace(/^#{1,6} /, "");
                      view.dispatch({
                        changes: {
                          from: line.from,
                          to: line.to,
                          insert: `${"#".repeat(level)} ${lineContents}`,
                        },
                      });
                    })
                );
              });

              menu.showAtMouseEvent(event as MouseEvent);
              return true;
            }
            return false;
          },
          mousedown: (_view, _line, event: Event) => {
            return (
              event.target instanceof HTMLDivElement &&
              event.target.classList.contains(MARKER_CSS_CLASS)
            );
          },
        },
      })
    ),
  ];
}
