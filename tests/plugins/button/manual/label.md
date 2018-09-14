@bender-tags: 4.10.2, 421, bug, editor, button
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, language

Click `Language` button.

## Expected

* **aria-expanded:** true
* **label:** Set language

## Unexpected

* **aria-expanded:** null
* **label:** Set language (Selected)
