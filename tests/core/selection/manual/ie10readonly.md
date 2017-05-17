@bender-tags: selection, tc, 4.7.0, 9780, 16820
@bender-ckeditor-plugins: wysiwygarea,toolbar

## IE throw an error in read only mode.

Note: Problem occured on IE10 and below only.
1. Use IE browser (IE10 or older)
1. click in editor area

**Expected:** no errors in test or console

**Unexpected:** visible error in console, most probably refered to missing property with name `ownerDocument`
