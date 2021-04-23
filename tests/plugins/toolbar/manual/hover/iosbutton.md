@bender-tags: 4.16.1, 4611, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, language

## Procedure (Moono-Lisa on iOS device)

1. Check if buttons have hover styles (darker background) by long tapping on them and releasing the finger.

  ### Expected result

  * There aren't hover styles **during** the tap.
  * Upon releasing finger, the hover styles "flashes" before the button gets into toggled on state.

  ### Unexpected result

  * There are hover styles **during** the tap.
  * Releasing the finger didn't cause the "flash" of hover styles.

2. Check if the button is in its toggled on state (lighter background) after the tap.

  ### Expected result

  * Tapped button has toggled on state.

  ### Unexpected result

  * Tapped button does not have toggled on state.

3. Repeat the procedure for the second editor.
