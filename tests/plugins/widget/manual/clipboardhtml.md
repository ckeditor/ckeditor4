@bender-tags: 4.12.0, feature, 3138
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar

**NOTE:** It's expected that if you paste the same widget multiple times, message won't change. Counter changes only during `copy`, `cut` and `drop` operations.

Manipulate the widget by:

* copying and pasting
* cutting and pasting
* dragging and droping

## Expected

After each operation widget content changes into `Widget has beed copied X times!` where `X` changes after every operation. 

## Unexpected

Widget message doesn't change.
