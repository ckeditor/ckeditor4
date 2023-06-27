@bender-tags: 4.17.0, 4.22.0, bug, 4444, 5412
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, preview, font, colorbutton, format, clipboard, pagebreak, toolbar, floatingspace, link, image2

1. Wait for the editor to load.
2. Click preview button.

 **Expected result** New browser tab/window with preview is opened correctly. The content is the same as in editor.

3. Open browser console in the newly opened tab.

 **Expected result** There is no error in the browser console.

 **Unexpected result** There is an error in the browser console: `Permission denied to access property "_cke_htmlToLoad" on cross-origin object`

## Notes

You can add more content into editable or just copy existing to check if the preview still opens e.g. add 50 pages and click preview.
