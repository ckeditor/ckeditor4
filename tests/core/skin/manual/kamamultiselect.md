@bender-tags: 4.17.3, bug, 5044
@bender-ckeditor-plugins: widget, wysiwygarea
@bender-ui: collapsed

1. Right click in the document area and choose 'Open dialog' from the context menu.
1. Choose one or more elements from either one of the multiple select elements.
1. Click outside of the multiple select element with one or more selected elements so that it loses focus.

## Expected

Selected elements should have a gray highlight.

## Unexpected

Selected elements are not highlighted, and are indistinguishable from non selected elements.
