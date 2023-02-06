@bender-tags: 4.20.2, bug, 439
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog

1. Click `Open Dialog` button.
2. Play with radio groups:

Check:

* Tab key will enter the radio group.

* When Tab or Shift+Tab into a radio group, focus goes to the selected radio button. If none is selected, focus goes to the first radio button if Tab was pressed, or the last radio bottom if Shift+Tab was pressed.

* When focus is on any radio button, Tab or Shift+Tab will exit the radio group.

* Up Arrow and Left Arrow moves focus to the previous radio button in the group, and selects that button. If focus is on the first item, then focus wraps to last item.

* Down Arrow and Right Arrow moves focus to the next radio button in the group, and selects that button. If focus is on the last item, then focus wraps to first item.

* Space selects the radio button with focus and de-selects other radio buttons in the group.
