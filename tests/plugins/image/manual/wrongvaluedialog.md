@bender-tags: 4.8.0, bug, 889
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, floatingspace, image

**Please note**: You can use such link: `http://lorempixel.com/200/100`.

1. Open image dialog.
2. Set some proper image url.
3. Unlock ratio.
4. Change width to 0 or negative value.
5. Click "OK"
  * **Expected result**: Popup with information that `width` should be proper HTML number value.
6. Click "OK" on popup.
7. set width to positive value and change width to negative value or 0.
8. Click "OK".
  * **Expected result**: The same popup should be shown but with information about `height`.

