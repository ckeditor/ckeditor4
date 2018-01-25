@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage

1. Click on image widget.
2. Click on button without the icon inside the balloon toolbar.

## Expected:

* Widget gets red background.
* Button state is changed to "on".


1. Click "Source" button.
2. Click it once more to close source view.

## Expected:

* Widget still has red background.


1. Click on widget.
1. Click on the button in balloon toolbar.

## Expected

* Widget returns to default appearance.
* Button state is changed to "off".
