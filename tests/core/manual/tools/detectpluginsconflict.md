@bender-tags: 4.10.1, bug, 1791
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image, image2, easyimage

1. Open console.
1. Check loaded image plugin type by clicking image icon.

## Expected

* `Easyimage` plugin is loaded.
* Two console warining:

``` 
[CKEDITOR] Error code: editor-plugin-conflict.
{plugin: "image", replacedWith: "easyimage"}

[CKEDITOR] Error code: editor-plugin-conflict.
{plugin: "image2", replacedWith: "easyimage"}
```

## Unexpected

* `Image` or `Image2` plugins are loaded.
* No or different console warnings.
