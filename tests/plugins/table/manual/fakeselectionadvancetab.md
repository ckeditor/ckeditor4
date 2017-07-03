@bender-tags: 4.7.2, tc, bug, 579
@bender-ui: collapsed
@bender-ckeditor-plugins: dialogadvtab,table,tableselection,wysiwygarea

1. Select at least to 2 cells in table
1. Right click and select `Table Properties`
1. Make sure that selection is now fake (selection colour change to grey)
1. Go to `Avanced` tab
1. Check `Stylesheet Classes`, it should be empty

**Unexpected:** `Stylesheet Classes` contains internal cke class with fakeselection
