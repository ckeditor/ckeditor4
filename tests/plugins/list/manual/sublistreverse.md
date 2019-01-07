@bender-tags: bug, 2721
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, list,sourcearea, undo, elementspath

1. Place caret in list after dollar symbol (`$`).
1. Press backspace two times.

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
