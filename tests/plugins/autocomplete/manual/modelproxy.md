@bender-tags: 4.10.0, feature, 2069
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Focus the first editor.
2. Type "@" character.

## Expected

* Entries are sorted ascending.
* Entries are limited to **3** matches.

---

1. Focus the second editor.
2. Type "@" character.

## Expected

* Entries are sorted descending.
* Entries are limited to **4** matches.