@bender-tags: 4.15.0, bug, 4060
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea

1. Switch editor to source mode.

	### Expected

	`<script src="data:text/javascript,''"></script>` is present in the source.

	### Unexpected

	`script` element is removed or transformed/commented out.
2. Switch back to WYSIWYG mode.
3. Press "Check source protection" button and inspect the result below the button.

	### Expected

	There is "Ok" text on green background.

	### Unexpected

	There is "Not ok" text on red background.
4. Repeat steps 1-3 several times.
