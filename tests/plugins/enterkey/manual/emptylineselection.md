@bender-tags: 4.16, bug, 4626
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, enterkey

1. Place a cursor right after 'foo'

```
foo
   ^ - put selection here
```

2. Press `Enter` twice.

3. Press `Left` key to move the cursor to the empty line

4. Type 'bar'

## Expected

The text 'bar' is bold and italic.

## Unexpected

The text 'bar' is unformatted.
