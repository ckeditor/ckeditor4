@bender-tags: tc, link, 9192, 4.5.5
@bender-ui: collapsed
@bender-ckeditor-plugins: link, toolbar, wysiwygarea

----

1. Open link dialog and choose "Email" from "Link type" dropdown.
2. Fill in only "E-mail address" field with `test@test.com`
3. Click "OK" and then double-click on link to open dialog (or click and use toolbar button).

**Expected:**
* The address in the "E-mail address" field should be equal to `test@test.com`.
