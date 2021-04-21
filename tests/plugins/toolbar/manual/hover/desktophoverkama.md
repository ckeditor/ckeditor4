@bender-tags: 4.16.1, 4611, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, stylescombo, language

## Procedure (Kama)

1. Check if buttons have hover styles.

  ### Expected result

  * There are hover styles (e.g. background became darker).

  ### Unexpected result

  * There aren't hover styles.

  ### Notes:

  * Kama does not provide hover and active styles for active rich combos.
  * Repeat the procedure for both on and off buttons (e.g. with "Bold" before and after toggling on).

2. Check if clicking on buttons activate their active state.

  ### Expected result

  * Clicked button has active state (e.g background became lighter).

  ### Unexpected result

  * Clicked button does not have active state.

3. Repeat the procedure for the second editor.
4. Repeat the procedure for rich combos.
