@bender-ui: collapsed
@bender-tags: 4.5.4, tc
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, divarea, clipboard

Test whether right-click opens correct context menu in the two editors.

Note:

* Right clicking within the editor should bring:
  * native context menu in the first editor,
  * custom context menu in the second editor.
* Right clicking on the editor chrome should not bring any context menu.
  * **Known issue:** on some IEs when right-clicking a toolbar button, the native context menu appears.