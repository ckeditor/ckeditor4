@bender-tags: 4.16.2, 4444, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, preview, font, colorbutton, format, clipboard, pagebreak, toolbar, floatingspace, link, image2

## Steps
1. Wait for the editor to load.
2. Click preview button.

 **Expected result** New browser tab with preview are opened correctly.

3. Open browser console in the new tab.

 **Expected result** There is no error in browser console.

 **Unexpected result** There is an error in browser console: `Permission denied to access property "_cke_htmlToLoad" on cross-origin object`.

## Notes
You can add more content into editable or just copy existing to check if the preview still opens e.g. add 50 pages and click preview.
