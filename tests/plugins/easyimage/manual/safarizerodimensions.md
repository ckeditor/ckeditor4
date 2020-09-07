@bender-tags: 4.15.0, feature, 4183
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, easyimage
@bender-include: ../_helpers/tools.js

1. Switch editor to source mode.
2. Switch back.

	### Expected:

	Image is visible.

	### Unexpected:

	Image disappeared.

3. Repeat the procedure several times for every editor.
4. Remove the image and upload another one. Repeat the procedure.

### Note:

Sometimes image is not visible at the beginning. It shouldn't bother you - just proceed with the test.
