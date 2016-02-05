@bender-ui: collapsed
@bender-tags: tc, copyformatting
@bender-ckeditor-plugins: copyformatting, contextmenu, toolbar, wysiwygarea, floatingspace

**Collapsed selection**

1. Place cursor inside "Apollo 11" text.
2. Click "Copy Formatting" button in the toolbar.
3. Click inside "spaceflight" word.
4. Repeat the procedure, but instead of clicking press "Context menu" key and choose "Apply style".

**Expected:** "spaceflight" becomes bold and underlined.

---

**Selection**

1. Select "was the" text.
2. Click "Copy Formatting" button in the toolbar.
3. Select "landed" word with mouse.
4. Repeat the procedure, but instead of selecting with mouse, select text with keyboard and then press "Context menu" key and choose "Apply style".

**Expected:** "landed" becomes strikedthrough.


