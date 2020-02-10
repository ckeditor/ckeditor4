@bender-tags: 4.14.0, bug, 3769
@bender-ui: collapsed
@bender-ckeditor-plugins: image2, wysiwygarea, toolbar, sourcearea, floatingspace, elementspath

1. Place collapsed selection inside first paragraph.
2. Press `SHIFT + Arrow Down` multiple times.

	**Expected:** Only the first paragraph gets selected.

3. Change image alignment to right.
4. Repeat 1-2 step again.

	**Expected:** Only the first paragraph gets selected.
