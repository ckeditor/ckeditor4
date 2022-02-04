@bender-tags: 4.17.2, bug, 5061
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, find, sourcearea

1. Open Find and Replace dialog and move to `Replace` tab.
1. In `Find what:` input type `Replace me`.
1. In `Replace with` input type `Foo   bar` (note **three spaces** between words).
1. Click `Replace All` button.

**Expected** Three spaces between "Foo" and "bar" are preserved.

**Unexpected** There is only one space between "Foo" and "bar".
