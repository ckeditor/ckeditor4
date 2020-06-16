@bender-tags: 4.10.1, bug, 1791
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image, image2, easyimage
@bender-include: %BASE_PATH%/plugins/easyimage/_helpers/tools.js

1. Open console.
1. Check loaded image plugin type by clicking image icon.

## Expected

* Easyimage plugin is loaded.
* Console warinings:

``` 
[CKEDITOR] Error code: editor-plugin-conflict.
{plugin: "image", replacedWith: "easyimage"}
```

```
[CKEDITOR] Error code: editor-plugin-conflict.
{plugin: "image2", replacedWith: "easyimage"}
```

## Unexpected

* Image plugin is loaded.
* Image2 plugin is loaded.
* No or different console warnings.
