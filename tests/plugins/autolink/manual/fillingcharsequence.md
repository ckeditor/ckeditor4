@bender-ui: collapsed
@bender-tags: 4.11.0, feature, 1815
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, autolink

1. Focus the editor.
1. Type `http://example.com example http://example.com`.

**Expected**

* Links are turned into anchors.
* Typed text structure is preserved.

**Unexpected**

* Links are not turned into anchors.
* Typed text structure is modified e.g. `http://example.com ehttp://example.com`
