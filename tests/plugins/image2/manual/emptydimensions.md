@bender-tags: 4.5.0, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, floatingspace, image2

**Please note**: You can use such link: `http://lorempixel.com/200/100`.

1. Open image dialog.
2. Set some proper image url and focus out.
  * **Expected result**: Dimensions inputs should be empty.
3. Set another proper image url and focus out.
  * **Expected result**: Again - dimensions inputs should be empty.

----

1. Open image dialog.
2. Set some proper image url and focus out.
3. Click button "Reset Size".
4. Set some proper image url and focus out.
  * **Expected result**: Dimensions inputs should be empty.
