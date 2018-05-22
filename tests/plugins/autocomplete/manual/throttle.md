@bender-tags: 4.10.0, bug, 1997
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, autocomplete, textmatch

1. Focus the editor.
1. Type `@`.
1. Wait until dropdown appear.
1. Immediately type `a`.

## Expected

1. After `@` character dropdown should contain `'@anna', '@thomas', '@jack'` items and appear immediately.
1. After `a` character dropdown should contain only `'@anna'` item and appear after 3000ms.

## Unexpected

Dropdown or items appears in invalid order or after invalid time intervals.
