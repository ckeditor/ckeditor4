@bender-tags: 4.5.0, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, enterkey, htmlwriter, sourcearea

---

1. Open browser developer console.
1. Select text from the end. E.g. `commodo consequat.`.
2. Click below the whole paragraph.
3. Press `enter` key.

**Expected:** No error occurred in the browser developer console.

**Unexpected result:** An error in the browser developer console occurred: `Uncaught TypeError: Cannot read property 'isContextFor' of null`

#### Notes:
On different browsers, the caret may behave differently.

