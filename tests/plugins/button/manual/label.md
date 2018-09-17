@bender-tags: 4.10.2, 421, bug, editor, button
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, language

## Normal mode

1. Click `Language` button.

### Expected

* **aria-expanded:** true
* **label:** Set language

### Unexpected

* **aria-expanded:** null
* **label:** Set language (Selected)

## Screen reader

**Note**: you need to enable screen reader for this test.

1. Click `Language` button.
1. Blur `Language` button by clicking outside of the editor.

### Expected

* When menu is opened, screen reader reads "menu".
* When menu is closed, screen reader reads "leaving menu".

### Unexpected

Invalid or missing screen reader reads.
