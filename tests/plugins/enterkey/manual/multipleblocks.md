@bender-tags: 4.11.0, bug, 2205
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, enterkey, list

1. Place a cursor right under list item.

```
* foo
  ^ - put selection here 
```

2. Press `Enter`.

## Expected

New list item has been added at the end of the list.

## Unexpected

List has been removed from the editor.
