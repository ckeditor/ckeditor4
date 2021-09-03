@bender-tags: 4.14.0, libreoffice, feature, generic
@bender-ui: collapsed
@bender-ckeditor-plugins: a11yhelp, about, basicstyles, bidi, blockquote, clipboard, colorbutton, colordialog, contextmenu, dialogadvtab, div, elementspath, enterkey, entities, filebrowser, find, floatingspace, font, format, forms, horizontalrule, htmlwriter, iframe, image, indentblock, indentlist, justify, language, link, list, liststyle, magicline, maximize, newpage, pagebreak, pastefromlibreoffice, pastetext, preview, print, removeformat, resize, save, selectall, showblocks, showborders, smiley, sourcearea, specialchar, stylescombo, tab, table, tabletools, templates, toolbar, undo, wysiwygarea

1. Open document in Libre Office: [document](../generated/_fixtures/Images/Multi_feature_document/multifeaturedocument.odt)
2. Copy it and paste to the editor.

## Expected
Pasted document looks the same as source one.

## Unexpected
Pasted document has missing styles.
