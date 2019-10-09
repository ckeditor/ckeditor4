@bender-ui: collapsed
@bender-tags: 4.13.1, bug, 1653, balloontoolbar
@bender-ckeditor-plugins: wysiwygarea,toolbar,balloontoolbar,link

## Please notice that both editable and entire document should have a scrollbar.

If editors are not visible in the test please scroll down the page.

1. Put selection inside a link to show balloontolbar.
2. Scroll editable.
3. You can use other links and scroll document to test different variation.

### Expected
* During scroll operation balloontoolbar should remain attached to the link.
* When link moves outside of editable, balloontoolbar should remain inside editable.
