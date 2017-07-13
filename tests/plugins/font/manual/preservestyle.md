@bender-tags: 4.8.0, feature, 584
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, font, elementspath, sourcearea

1. Select some text.
1. Change `font size`, (e.g. `24`).
1. Select this same text. So size on list has selected proper option.
1. Select this same size once again (e.g. `24`).
1. Text should preserve proper font size.
1. Now select option `(Default)` to reset font size.
1. Font size should reset to default one and `<span>` with font size style should disappear.
1. Repeat those same steps for the `font name`.

**Expected:** Choosen font size/name will remain this same, after click into it. It still will be marked on dropdown menu and text preserve chosen style after reapplying it multiple times.

**Unexpected:** Font size/name will be deselct and style dissapear from the text when clicked 2nd time.
