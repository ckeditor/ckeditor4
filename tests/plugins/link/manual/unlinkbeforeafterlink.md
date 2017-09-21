@bender-tags: bug, link, editor, trac13062, 4.7.0
@bender-ui: collapsed
@bender-ckeditor-plugins: link, toolbar, elementspath, wysiwygarea

----

1. Place the cursor just before the link's text in first paragraph (check in element's path that you're still inside the link).
2. Click the unlink button.

**Expected:**
* The link is removed.

---

1. Place the cursor just after the link's text in second paragraph (check in element's path that you're still inside the link).
2. Click the unlink button.

**Expected:**
* The link is removed.

---

1. Place the cursor just after the last link's text in third paragraph (check in element's path that you're still inside the link).
2. Click the unlink button.

**Expected:**
* The link is removed.

**Unexpected:**
* All links in paragraph are removed.
* Strikethrough is removed.
