@bender-tags: 4.10.1, bug, 1791
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image, image2

1. Open console.
1. Check loaded image plugin type by clicking image icon.

## Expected

* `Image2` plugin is loaded.
* Console warining:
``` 
[CKEDITOR] Error code: editor-plugin-conflict.
{plugin: "image", replacedWith: "image2"}
```

## Unexpected

* `Image` plugin is loaded.
* No or different console warning.
