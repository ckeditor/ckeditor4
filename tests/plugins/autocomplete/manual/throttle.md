@bender-tags: 4.10.0, bug, 1997
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch
@bender-include: _helpers/utils.js

1. Read expected section before starting the test.
1. Focus the editor using mouse.
1. Type `@`.
1. Wait until dropdown appear.
1. Immediately type `a`.

## Expected

1. After `@` character dropdown should contain multiple items and appear immediately.
1. After `a` character dropdown should contain only `'@anna'` item and appear after 3000ms.

## Unexpected

Dropdown or items appears in invalid order or after invalid time intervals.
