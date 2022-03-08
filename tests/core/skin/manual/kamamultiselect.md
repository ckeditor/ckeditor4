@bender-tags: 4.18.0, bug, 5044
@bender-ckeditor-plugins: widget, wysiwygarea
@bender-ui: collapsed

1. Click on the 'Open dialog' button.
1. Choose one or more elements from the multiple select.
1. Click outside of the multiple select element after one or more elements are selected so that it loses focus.

## Expected

Selected elements should have a gray highlight.

## Unexpected

Selected elements are not highlighted, and are indistinguishable from non selected elements.
