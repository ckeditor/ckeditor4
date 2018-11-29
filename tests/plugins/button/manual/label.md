@bender-tags: 4.11.0, 421, bug, editor, button
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, language

**Note**: you need to enable screen reader for this test.

1. Focus the editor.
1. Press `alt+f10` to focus toolbar.
1. Press `space` to open `Language` menu.
1. Press `esc` to close `Language` menu.

### Expected

* **aria-expanded:** true
* **label:** Set language
* When menu is opened, screen reader reads "expanded".
* When menu is closed, screen reader reads "leaving menu".

### Unexpected

* **aria-expanded:** null
* **label:** Set language (Selected)
* Invalid or missing screen reader reads.
