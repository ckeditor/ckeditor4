@bender-tags: 4.16.1, 4611, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo, format

## Procedure (Moono-Lisa on iOS device)

1. Check if rich combos have hover styles (darker background) by long tapping on them and releasing the finger.

  ### Expected result

  * There aren't hover styles **during** the tap.
  * Upon releasing finger, the hover styles "flashes" before the combo gets into toggled on state.

  ### Unexpected result

  * There are hover styles **during** the tap.
  * Releasing the finger didn't cause the "flash" of hover styles.

2. Check if the rich combo is in its toggled on state ("pressed in" combo) after the tap.

  ### Expected result

  * Tapped rich combohas toggled on state.

  ### Unexpected result

  * Tapped rich combo does not have toggled on state.

3. Check if toggled on rich combos have hover styles (additional shadow, "deeper pressed in" combo) by long tapping on them and releasing the finger.

  ### Expected result

  * There aren't hover styles **during** the tap.
  * Upon releasing finger, the hover styles "flashes" before the rich combo gets into off state.

  ### Unexpected result

  * There are hover styles **during** the tap.
  * Releasing the finger didn't cause the "flash" of hover styles.

4. Repeat the procedure for the second editor.
