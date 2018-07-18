@bender-ui: collapsed
@bender-tags: feature, 4.11.0, 1679
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea

# Play around with splitbutton plugin
## Expected behaviour to test:
1. Split button face remain static and doesn't change its icon.
1. Face has proper state according to current selection.
1. Pressing on face applies last picked option from its menu or removes styling if last picked option is already applied to current selection.
1. Menu items state matches current selection.
1. Menu items applies/removes style from current selection.

### Note:
IE and Edge doesn't support custom CSS underline styles. To test if it works you need to look at source area.
