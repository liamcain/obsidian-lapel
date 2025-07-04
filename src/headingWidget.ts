import { EditorView, ViewPlugin, ViewUpdate, gutter, GutterMarker } from "@codemirror/view";
import { editorLivePreviewField, Menu } from "obsidian";
import { syntaxTree, lineClassNodeProp} from "@codemirror/language";
import { Prec, RangeSet, RangeSetBuilder } from "@codemirror/state";

const headingLevels = [1, 2, 3, 4, 5, 6];
const MARKER_CSS_CLASS = "cm-heading-marker";

class HeadingMarker extends GutterMarker {
  constructor(
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

  // Prevent redrawing the same marker.
  eq(other: HeadingMarker) {
    return this.headingLevel === other.headingLevel;
  }
}

export function headingMarkerPlugin(showBeforeLineNumbers: boolean) {
  const markers = ViewPlugin.fromClass(
    class {
      view: EditorView;
      markers: RangeSet<HeadingMarker>;

      constructor(view: EditorView) {
        this.view = view;
        this.markers = this.buildMarkers(view);
      }

      buildMarkers(view: EditorView) {
        // Only draw the markers inside the viewport.
        const {viewport} = view;
        const builder = new RangeSetBuilder<HeadingMarker>();
        syntaxTree(view.state).iterate({
          from: viewport.from,
          to: viewport.to,
          enter: ({type, from, to}) => {
            const headingExp = /header-(\d)$/.exec(type.prop(lineClassNodeProp) ?? "");
            if (headingExp) {
              const headingLevel = Number(headingExp[1]);
              const d = new HeadingMarker(view, headingLevel, from, to);
              builder.add(from, to, d);
            }
          },
        });

        return builder.finish();
      }

      update(update: ViewUpdate) {
        // Don't render if Live Preview is disabled
        if (!update.state.field(editorLivePreviewField)) {
          this.markers = RangeSet.empty;
        }

        // Rebulid only when the document or the viewport was changed.
        if (update.docChanged || update.viewportChanged) {
          this.markers = this.buildMarkers(this.view);
        }
      }
    }
  );

  const gutterPrec = showBeforeLineNumbers ? Prec.high : Prec.low;
  return [
    markers,
    gutterPrec(
      gutter({
        class: "cm-lapel",
        markers(view) {
          return view.plugin(markers)?.markers || RangeSet.empty;
        },
        domEventHandlers: {
          click: (view, block, evt: MouseEvent) => {
            if (evt.targetNode?.instanceOf(HTMLElement)) {
              const el = evt.targetNode;
              if (!el.hasClass(MARKER_CSS_CLASS)) return false;
              if (el.hasClass('has-active-menu')) return true;

              const menu = new Menu();
              for (const level of headingLevels) {
                menu.addItem((item) =>
                  item
                    .setIcon("lucide-heading-" + level)
                    .setTitle(`Heading ${level}`)
                    .onClick(() => {
                      const line = view.state.doc.lineAt(block.from);
                      const lineContents = line.text.replace(/^#{1,6} /, "");
                      view.dispatch({
                        changes: {
                          from: line.from,
                          to: line.to,
                          insert: `${"#".repeat(level)} ${lineContents}`,
                        },
                      });
                    })
                );
              }

              menu
                .setParentElement(el)
                .showAtMouseEvent(evt);
              return true;
            }
            return false;
          },
          mousedown: (_view, _line, evt: MouseEvent) => {
            if (evt.targetNode?.instanceOf(HTMLElement)) {
              return evt.targetNode.hasClass(MARKER_CSS_CLASS);
            }
            return false;
          },
        },
      })
    ),
  ];
}
