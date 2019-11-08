@bender-ui: collapsed
@bender-tags: 4.13.1, bug, 1653, balloontoolbar
@bender-ckeditor-plugins: wysiwygarea,toolbar,balloontoolbar,link

## Please notice that both editable and entire document should have a scrollbar.

If editors are not visible in the test please scroll down the page.

1. Put selection inside a link to show balloontolbar. There are multiple links in each editor spread in the content.
2. Scroll editable.
3. Use other links and scroll document to test different variations of balloon toolbar and scroll position.

### Expected
* During scroll operation balloontoolbar should remain attached to the link.
* When link moves outside of editable, balloontoolbar should remain inside editable.

### Note
* There is a bug that balloon toolbar doesn't hide when editor is outside of view port for divarea editors [#3632](https://github.com/ckeditor/ckeditor4/issues/3632).
