@bender-ui: collapsed
@bender-tags: 4.17.0, clipboard, 4807
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, image, clipboard, sourcearea

 1. Open Developer Tools and make sure log output contains the `Verbose` level.
 1. Paste an image with a size of 20-25 MB from your clipboard into the editor.
 1. Observe the browser console. The [Violation] log  with `'paste' handler` message appear. Logs may appear after a small delay.

**Expected** Time from violation log is under 2000ms.

**Unexpected** The violation loog is over 7000ms.