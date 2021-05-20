@bender-tags: 4.16.1, 4611, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, stylescombo, format

## Procedure (Kama on Android device)

1. Check if buttons have hover styles (light-blue background) by long tapping on them and releasing the finger.

  ### Expected result

  * There are hover styles **during** the tap.
  * There aren't any hover styles **after** releasing the finger.

  ### Unexpected result

  * There aren't any hover styles **during** the tap.
  * There are hover style **after** releasing the finger.
3. Repeat the procedure for the second editor.
