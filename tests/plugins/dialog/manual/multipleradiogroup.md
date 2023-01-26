@bender-tags: 4.21.0, bug, 439
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, dialog

1. Click `Open Dialog` button.
2. Play with radio groups:

Check:

* Moving focus between radio groups working properly.

* Moving focus outside the radio groups.

* Properly moving focus to the previously checked position.

**Note** Correct focus behavior. <br>
When the focus moves to the radio group by using the `Tab` key, it is checked whether any element has been previously selected, if so, the focus will be sen on this element, otherwise the focus will be set on the first element. <br><br>
Changing the focus using `Shift + Tab` key is the same, the difference is to set the focus to the last element of the radio group in case when none is selected. <br><br>
Setting the focus of the radio element with the cursor and changing the focus again with the `Tab` or `Shift + Tab` key, sets the focus to the next or previous element.
