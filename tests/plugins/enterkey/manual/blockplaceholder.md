@bender-tags: 4.11.2, bug, 2205
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, enterkey, list

1. Place a cursor right under list item.

```
* foo
  ^ - put selection here 
```

2. Press `Enter`.

## Expected

Empty line has been replaced by the new empty list item.

## Unexpected

List has been removed from the editor.
