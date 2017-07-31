@bender-tags: 4.8.0, feature, 584
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, elementspath, sourcearea

Note: Perform below scenario for both `Font size` and `Font family` drop-downs.

----

1. Select some text.
1. Change `Font size` (e.g. `24`).
1. Select this same text.
  * `Font size` drop-down shows size selected in a previous step.
1. Select this same size once again (e.g. `24`).
  * Selected text should preserve its font size.
1. Select option `(Default)` to reset the `Font size`.
  * `Font size` should reset to default one and `<span>` element with `Font size` style should disappear.

**Expected:** Choosen font size/name will remain the same, after click on its corresponding item in the drop-down menu. The item will remain marked as active. Selected text preserves chosen style after reapplying it multiple times.
