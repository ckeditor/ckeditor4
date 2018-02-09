@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, easyimage, autogrow
@bender-include: ../_helpers/tools.js

# Custom Progress

This manual test shows an example of different progress indicators.

1. Drag and drop any image file into "Default progress bar" editor.
1. Observe progress indicator.
	## Expected

	Progress indicator matches editor name and is different from other editors.
1. Repeat above steps for remaining editors.


Note: it might not work on **Edge** due to an [upstream bug](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/).

Pro tip: you might want to [use browser throttling](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference?hl=en#throttling) to make uploads longer.
