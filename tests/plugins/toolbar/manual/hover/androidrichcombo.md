@bender-tags: 4.16.1, 4611, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo, format

## Procedure (Moono-Lisa on Android device)

1. Check if rich combos have hover styles by long tapping on them and releasing the finger.

  ### Expected result

  * There are hover styles (lighter background) **during** the tap.
  * **after** releasing the finger the background becomes darker.

  ### Unexpected result

  * There aren't any hover styles **during** the tap and **after** it.

2. Check if taping on rich combos activate their toggled on state (lighter background).

  ### Expected result

  * Tapped rich combo has toggled on state.

  ### Unexpected result

  * Tapped rich combo does not have toggled on state.

3. Repeat the procedure for the second editor.
