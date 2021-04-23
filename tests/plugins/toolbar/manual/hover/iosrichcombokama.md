@bender-tags: 4.16.1, 4611, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo, format

## Procedure (Kama on iOS device)

1. Check if rich combos have hover styles (light-blue background) by long tapping on them and releasing the finger.

  ### Expected result

  * There aren't hover styles **during** the tap.
  * Upon releasing finger, the hover styles "flashes" before the combo gets into toggled on state.

  ### Unexpected result

  * There are hover styles **during** the tap.
  * Releasing the finger didn't cause the "flash" of hover styles.

2. Repeat the procedure for the second editor.
