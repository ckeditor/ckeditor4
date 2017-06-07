@bender-tags: widget, tc, 13703
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, floatingspace, elementspath, enterkey, placeholder

### Test if backspace properly merges adjacent block components

We're testing to ensure that when we press delete/backspace, block tags are merged. As such, the 1> is in an &lt;i&gt;
tag to ensure that we can properly navigate tag hierarchy

Run all steps in both classic and inline editors.

1. Find 1>
2. Put cursor at right of >
3. Press delete ('forward delete')
 #### Expected
 Space between > and the placeholder was deleted, text now on one line: 1>[Test1]

4. Press delete again.
 #### Expected
 Placeholder widget was selected, not deleted

5. Find <2 press backspace
 #### Expected
 Text should be on one single line: 1>[Test1]<2

6. Press backspace again
 #### Expected
 Placeholder widget was selected, not deleted

