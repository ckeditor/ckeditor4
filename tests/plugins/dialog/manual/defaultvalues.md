@bender-tags: 4.11.0, feature, 2277, dialog
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, link

## Info tab

1. Click `link` button.
1. Wait until dialog show up.

## Expected

Procotol option value is `https://`.

## Unexpected

Protocol option value is `http://`.

## Advanced tab

Switch to `Advanced` tab.

## Expected

* ID input value is `1`.
* Name input value is `test`.

## Unexpected

* ID input value is empty.
* Name input value is empty.
