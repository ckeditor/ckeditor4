@bender-tags: 4.13.0, bug, range, 3158
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, enterkey, list

1. Open dev console.
2. Add list into the editor.
3. Create list item with 3 lines separated by soft enter using <kbd>SHIFT + ENTER</kbd> keyboard combination, i.e:

```
1. foo

   foo

   foo^
```

**Note** that you need to use 2x soft enter to create empty space.

4. Press undo button.

## Expected

Undo button undoes changes.

## Unexpected

* Error thrown in a dev console.
* Undo button clicks produces errors in a console and no longer undoes changes.
