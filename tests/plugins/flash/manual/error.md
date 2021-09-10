@bender-tags: 4.17.0, feature, 4866
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, flash

1. Open browser's console.

**Expected**
 * The editor loading process was aborted with the console error:
```
[CKEDITOR] Error code: editor-plugin-deprecated.
{ pluginName: "flash" }
```

**Unexpected**
 * Editor was correctly loaded.
 * No or different console errors.
