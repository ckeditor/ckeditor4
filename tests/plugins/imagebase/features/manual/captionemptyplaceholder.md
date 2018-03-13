@bender-tags: 4.9.1, bug, 1776
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, imagebase
@bender-include: %BASE_PATH%/plugins/easyimage/_helpers/tools.js

1. Focus widget without caption.
1. Put some content into the empty caption.
1. Focus widget with non-empty caption.
1. Select all content inside the caption and delete it.
1. Blur the widget.

## Expected result

Caption for the last widget is hidden.

## Actual result
Caption is still visible, despite the fact it's empty.
