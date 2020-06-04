@bender-tags: 4.10.1, bug, 1791
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image, easyimage
@bender-include: %BASE_PATH%/plugins/easyimage/_helpers/tools.js

1. Open console.
1. Check loaded image plugin type by clicking image icon.

## Expected

* Easyimage plugin is loaded.
* Console warining:
``` 
[CKEDITOR] Error code: editor-plugin-conflict.
{plugin: "image", replacedWith: "easyimage"}
```

## Unexpected

* Image plugin is loaded.
* No or different console warning.
