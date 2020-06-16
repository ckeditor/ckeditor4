@bender-tags: bug, 2721, 4.11.3
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, list, sourcearea, undo, elementspath

1. Place caret in list after dollar symbol (`$`).
1. Press <kbd>Backspace</kbd> two times (once in IE).

## Expected

Sublist is ordered alphabetically:

```
1. Test
	1. a
	2. b
	3. c
```

## Unexpected

Sublist order is reversed:

```
1. Test
	1. c
	2. b
	3. a
```

## Note

There is known upstream issue on IE [#2774](https://github.com/ckeditor/ckeditor4/issues/2774) when after pressing <kbd>Backspace</kbd> only `li` element is removed and `ol` is preserved. This results in incorrect markup `ol > li > ol > ol > li`.
