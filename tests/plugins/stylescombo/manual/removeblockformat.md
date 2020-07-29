@bender-ui: collapsed
@bender-tags: bug, 4.14.2, 3649
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo, format, sourcearea, link, font

1. Select the entire editor contents.
1. Change the style to `Italic Title`.
1. Change the format to `Normal`.

  **Expected:** There is an unstyled paragraph in the editor.

  **Unexpected:** Paragraph has an italic style.

1. Go to source mode.

  **Expected:** Source code is `<p>Hello World!</p>`.

  **Unexpected:** Source code is not paragraph or there are some block styles added to it.
