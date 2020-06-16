@bender-tags: 4.9.0, feature, 932
@bender-ui: collapsed
@bender-ckeditor-plugins: sourcearea, wysiwygarea, floatingspace, toolbar, imagebase, link, htmlwriter, elementspath, contextmenu, easyimage

## Scenario 1

1. Right-click the first image to show the context menu.

### Expected

* There are no link connected options in the menu.

## Scenario 2

1. Add link to the first image in the editor.
2. Right click on it to show the context menu.
3. Click "Edit Link" and change URL of the link.

### Excepted

* There are link connected options in the menu.
* Editing link's URL actually changes link's URL.

## Scenario 3

1. Right-click the second image in the editor to show the context menu.
2. Choose "Unlink".

### Expected

* Link is removed.
