@bender-tags: 4.9.0, bug, 889
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, image2

**Please note**: You can use such link: `/tests/_assets/lena.jpg`.

1. Open image dialog.
2. Set proper image url.
3. Unlock ratio.
4. Change width to 0 or any negative value.
5. Click "OK"
  * **Expected result**: Popup with information that `width` should be proper HTML number value.
6. Close information popup.
7. Set width to positive value and change height to negative value or 0.
8. Click "OK" on popup.
  * **Expected result**: The same popup should be shown but with information about `height`.

