@bender-tags: 4.15.1, bug, 848
@bender-ui: collapsed
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, divarea

**Perform below steps for both editors**.

1. Switch OS keyboard to language requiring composition (Japanese, Chinese, Arabic).
1. Focus editor.
1. Type some text.

## Expected result

* Characters are merged correctly during typing.
* IME panel doesn't hide or hangs unexpectedly.
* Composition works correctly.

## Unexpected

* Characters aren't composed as they should be.
* Composition stops unexpectedly.
* IME panel becomes unresponsive.

**Note**: To check the expected result of composition you may check how it works in native `textarea`.
