@bender-tags: 4.16.1, feature, 4681
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, sourcearea, clipboard, undo, image, floatingspace

## Scenario 1

1. Open browser console.
1. Drag and drop image into the editable for each of accepted formats: `image/png`, `image/jpeg`, `image/gif`.
1. Repeat the above setps for inline editor.

## Expected:
There is no error in browser's console. Dragged image are pasted correctly and in created `<img>` tag `src` has base64 format. 
## Unexpected:
There is an error in browser's console. Image are not visible. 

## Scenario 2

1. Open browser console.
1. Drag and drop different file type than accepted, ex. `.pdf`.
1. Repeat the above setps for inline editor.

## Expected:
There is no error in browser's console. Editable is not changed. 
## Unexpected:
There is an error in browser's console. Editable is changed. 