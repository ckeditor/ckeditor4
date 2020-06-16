@bender-tags: mentions, feature, 4.10.0, 1934
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, mentions

Sad path
========

1. Focus the editor.
1. Type `@a`.

## Expected

View didn't show up.

## Unexpected

View showed up with `@Anna`, `@Annabelle` items.

Happy path
==========

1. Focus an editor.
1. Type `@A`

## Expected

View showed up with `@Anna`, `@Annabelle` items.

## Unexpected

View didn't showed up.
