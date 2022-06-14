@bender-tags: 4.19.1, bug, 5085
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, language, format

1. Copy sentence from the textarea.
2. Click source button to go to source mode.
2. Paste copied sentence to the source area and back to wysiwyg mode.
3. Go to source mode.

**Expected:** Wrapped `Salut` word by the span element should exist with added `dir="ltr"` attribute.

**Unexpected:** Span with `lang` attribute was removed.

4. Repeat above steps for divarea and inline editor.
