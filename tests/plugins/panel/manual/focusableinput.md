@bender-tags: 4.11.0, feature, 2453
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, panel

1. Click into `Test Panel` button in toolabr ( button without icon )
2. Use keyboard (arrow keys and tabs) to focus inner elements.
3. Check if you can focus **input** element with keyboard. _Currently focused elements are highlighted with red background._

### Expected:
* You can acess to `input` element with <kbd>TAB</kbd> or arrow keys.

### Unexpected:
* `Input` element is not focusable with keyboard.
