@bender-tags: 4.16.1, 4611, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, stylescombo, language

## Procedure (Moono-Lisa)

1. Check if buttons have hover styles by long tapping on them and releasing the finger.

  ### Expected result

  * On Android: there are hover styles **during** the tap (e.g. background becomes darker).
  * On iOS: hover styles can be absent during the tap.
  * There aren't any hover styles **after** releasing the finger.

  ### Unexpected result

  * On Android: there aren't any hover styles **during** the tap.
  * There are hover style (e.g. background became darker) **after** releasing the finger.

  ### Notes:

  * Moono-Lisa does not provide hover styles for active buttons.
  * On iOS long tap can also focus the editor.

2. Check if taping on buttons activate their active state.

  ### Expected result

  * Tapped button has active state (e.g background became lighter or the button seems "pressed").

  ### Unexpected result

  * Tapped button does not have active state.

3. Repeat the procedure for the second editor.
4. Repeat the procedure for rich combos.
