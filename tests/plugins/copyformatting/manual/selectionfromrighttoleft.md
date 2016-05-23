@bender-ui: collapsed
@bender-tags: tc, copyformatting
@bender-ckeditor-plugins: copyformatting, toolbar, wysiwygarea, floatingspace, elementspath, undo

**Steps to reproduce:**

1. Select or click inside "AAA" and click "Copy Formatting" button.
2. Select "BBB" from right to left. Note that the cursor should be slightly below the line with "BBB".

** Expected:** "BBB" gets styled.

**Unexpected:** "BBB" remains unstyled.
