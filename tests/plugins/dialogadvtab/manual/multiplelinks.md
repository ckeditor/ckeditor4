@bender-tags: 4.10.1, 1046, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link, dialogadvtab, sourcearea

1. Select "foo" word.
1. Press "Link" button.
1. Set URL to "aa".
1. Go to "Advanced" tab.
1. Set Id field to "aa".
1. Click OK.
1. Repeat steps 1-6, but this time by selecting "bar" and setting id to "bb".
1. Click "Source" button.

## Expected

Both links have a correct `id` value.

## Unexpected

Second link does not get the `id` attribute.
