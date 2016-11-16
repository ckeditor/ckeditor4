@bender-tags: link, tc, 4.6.0,
@bender-ui: collapsed
@bender-ckeditor-plugins: link,toolbar,wysiwygarea,sourcearea

1. Select link and open link dialog. Go to `Advanced` tab.
1. Check `Force Download` checkbox and click `OK` to close the dialog.
1. Switch to source mode and check if `download=""` attribute is added to the anchor element.
1. Remove `download=""` attribute, switch to editing mode and open link dialog.
1. Check on `Advanced` tab if `Force Download` checkbox is deselected.
