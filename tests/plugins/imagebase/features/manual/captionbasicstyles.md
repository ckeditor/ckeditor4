@bender-tags: 4.9.1, feature, 932, tp3384, 1646
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, imagebase, basicstyles

# Integration of caption and basicstyles

1. Focus widget.
2. Put cursor inside the caption. If caption contains text, delete it.
3. Apply "Bold".

## Expected

* Bold is applied.
* There is no visible placeholder.
* Selection remains inside the caption.

## Unexpected

* Placeholder shows up.
* Firefox/Edge: Selection is lost.

---

Repeat for all editors.
